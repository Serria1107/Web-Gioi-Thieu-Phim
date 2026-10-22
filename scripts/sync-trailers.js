import { writeFile, rename, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { movies } from "../js/movies.js";
import { trailerData as existingTrailerData } from "../js/trailer-data.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(scriptDirectory, "../js/trailer-data.js");
const tmdbToken = process.env.TMDB_READ_TOKEN;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const trustedChannelIds = new Set(
  (process.env.TRUSTED_YOUTUBE_CHANNEL_IDS ?? "")
    .split(",")
    .map((channelId) => channelId.trim())
    .filter(Boolean)
);
const retryUnverified = process.argv.includes("--retry");
const refreshVerified = process.argv.includes("--refresh");
const maxAttempts = 3;
const requestTimeoutMs = 15000;
const verificationTtlMs = 90 * 24 * 60 * 60 * 1000;

if (!tmdbToken || !youtubeApiKey) {
  throw new Error("Set TMDB_READ_TOKEN and YOUTUBE_API_KEY in the local environment before syncing.");
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function requestJson(url, options, label) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(requestTimeoutMs)
      });

      if (response.ok) return await response.json();

      if (![429, 500, 502, 503, 504].includes(response.status)) {
        throw new Error(`${label} returned HTTP ${response.status}.`);
      }
      lastError = new Error(`${label} returned HTTP ${response.status}.`);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith(`${label} returned HTTP `)
        && !/HTTP (429|500|502|503|504)\./.test(error.message)) {
        throw error;
      }
      lastError = error;
    }

    if (attempt < maxAttempts) await delay(400 * (2 ** (attempt - 1)));
  }

  throw new Error(`${label} failed after ${maxAttempts} attempts: ${lastError?.message ?? "unknown error"}`);
}

function normalize(value) {
  return String(value ?? "")
    .toLocaleLowerCase("en")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function movieMatches(result, movie) {
  const releaseYear = result.release_date?.slice(0, 4);
  const knownTitles = new Set([normalize(movie.title), normalize(movie.originalTitle)]);
  const resultTitles = [normalize(result.title), normalize(result.original_title)];
  return releaseYear === String(movie.year) && resultTitles.some((title) => knownTitles.has(title));
}

function titleMatches(movie, videoTitle) {
  const normalizedVideoTitle = normalize(videoTitle);
  return [movie.title, movie.originalTitle]
    .map(normalize)
    .filter((title) => title.length >= 3)
    .some((title) => normalizedVideoTitle.includes(title));
}

function isDisallowedTitle(title) {
  const normalizedTitle = normalize(title);
  return /\b(fan made|concept|ai (generated )?trailer|reaction|review|compilation)\b/.test(normalizedTitle);
}

function trailerPriority(title) {
  const normalizedTitle = normalize(title);
  const words = normalizedTitle.split(" ");
  if (!words.includes("official") || words.includes("unofficial")) {
    return Number.POSITIVE_INFINITY;
  }
  if (normalizedTitle.includes("official main trailer")) return 0;
  if (normalizedTitle.includes("official trailer")) return 1;
  if (normalizedTitle.includes("official final trailer")) return 2;
  if (normalizedTitle.includes("official teaser")) return 3;
  return Number.POSITIVE_INFINITY;
}

function isTrailerTitle(title) {
  const normalizedTitle = normalize(title);
  const words = normalizedTitle.split(" ");
  return words.includes("official")
    && !words.includes("unofficial")
    && (words.includes("trailer") || words.includes("teaser"));
}

function tmdbHeaders() {
  return { Authorization: `Bearer ${tmdbToken}`, accept: "application/json" };
}

async function searchTmdbMovie(movie) {
  if (movie.tmdbId) {
    const result = await requestJson(
      `https://api.themoviedb.org/3/movie/${encodeURIComponent(movie.tmdbId)}?language=en-US`,
      { headers: tmdbHeaders() },
      `TMDB lookup for ${movie.id}`
    );
    return movieMatches(result, movie)
      ? { match: result, candidates: [result] }
      : { match: null, candidates: [result] };
  }

  const terms = [...new Set([movie.originalTitle, movie.title].filter(Boolean))];
  const resultsById = new Map();

  for (const term of terms) {
    const params = new URLSearchParams({
      query: term,
      year: String(movie.year),
      include_adult: "false"
    });
    const result = await requestJson(
      `https://api.themoviedb.org/3/search/movie?${params}`,
      { headers: tmdbHeaders() },
      `TMDB search for ${movie.id}`
    );
    for (const resultItem of result.results ?? []) resultsById.set(resultItem.id, resultItem);
  }

  const matches = [...resultsById.values()].filter((result) => movieMatches(result, movie));
  if (matches.length === 1) return { match: matches[0], candidates: [...resultsById.values()] };
  return { match: null, candidates: [...resultsById.values()] };
}

async function getTmdbVideos(tmdbId, movieId) {
  const params = new URLSearchParams({ language: "en-US" });
  const result = await requestJson(
    `https://api.themoviedb.org/3/movie/${encodeURIComponent(tmdbId)}/videos?${params}`,
    { headers: tmdbHeaders() },
    `TMDB videos for ${movieId}`
  );
  return (result.results ?? [])
    .filter((video) => video.site === "YouTube" && video.type === "Trailer")
    .map((video) => ({
      videoId: video.key,
      title: video.name,
      tmdbOfficial: video.official === true,
      tmdbLinked: true,
      publishedAt: video.published_at ?? null,
      source: "TMDB"
    }));
}

async function searchYoutube(movie) {
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: "10",
    q: `${movie.title} ${movie.year} official trailer`,
    key: youtubeApiKey
  });
  const result = await requestJson(
    `https://www.googleapis.com/youtube/v3/search?${params}`,
    {},
    `YouTube search for ${movie.id}`
  );
  return (result.items ?? [])
    .filter((item) => item.id?.videoId)
    .map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet?.title ?? "",
      channelTitle: item.snippet?.channelTitle ?? "",
      channelId: item.snippet?.channelId ?? "",
      tmdbOfficial: false,
      tmdbLinked: false,
      publishedAt: item.snippet?.publishedAt ?? null,
      source: "YouTube search"
    }));
}

async function getYoutubeVideoDetails(videoIds, movieId) {
  if (!videoIds.length) return new Map();
  const details = new Map();

  for (let offset = 0; offset < videoIds.length; offset += 50) {
    const params = new URLSearchParams({
      part: "snippet,status",
      id: videoIds.slice(offset, offset + 50).join(","),
      key: youtubeApiKey
    });
    const result = await requestJson(
      `https://www.googleapis.com/youtube/v3/videos?${params}`,
      {},
      `YouTube video details for ${movieId}`
    );
    for (const item of result.items ?? []) details.set(item.id, item);
  }

  return details;
}

function clearDuplicatedVideoSelections(trailerRecords, currentMovies) {
  const ownersByVideoId = new Map();
  for (const movie of currentMovies) {
    const { id: movieId } = movie;
    const record = trailerRecords[movieId];
    if (record.trailerStatus !== "verified" || !record.trailerVideoId) continue;
    const owners = ownersByVideoId.get(record.trailerVideoId) ?? [];
    owners.push(movieId);
    ownersByVideoId.set(record.trailerVideoId, owners);
  }

  for (const [videoId, owners] of ownersByVideoId) {
    if (owners.length < 2) continue;
    console.warn(`Duplicate trailer ${videoId} selected for ${owners.join(", ")}; marking all for review.`);
    for (const movieId of owners) {
      const record = trailerRecords[movieId];
      record.trailerStatus = "needs_review";
      record.trailerVideoId = null;
      record.trailerTitle = null;
      record.trailerSourceUrl = null;
      record.trailerChannel = null;
      record.trailerChannelId = null;
      record.trailerOfficial = false;
      record.trailerVerifiedAt = null;
      record.trailerDiscoverySource = null;
      record.trailerCandidateVideoId = null;
      record.trailerCandidateOfficial = false;
      record.trailerCandidateEmbeddable = false;
      record.trailerCandidateChannel = null;
      record.candidateVideos = (record.candidateVideos ?? []).map((candidate) => candidate.videoId === videoId
        ? {
            ...candidate,
            officialCandidate: false,
            verified: false,
            reason: "This video was selected for more than one movie and requires manual review."
          }
        : candidate);
    }
  }
}

function createBaseRecord(movie, tmdbMovie, trailerStatus, candidates = [], trailerCandidate = null) {
  return {
    movieId: movie.id,
    tmdbId: tmdbMovie?.id ?? null,
    tmdbTitle: tmdbMovie?.title ?? null,
    tmdbOriginalTitle: tmdbMovie?.original_title ?? null,
    tmdbReleaseDate: tmdbMovie?.release_date ?? null,
    trailerVideoId: null,
    trailerTitle: null,
    trailerPlatform: "YouTube",
    trailerDiscoverySource: null,
    trailerSourceUrl: null,
    trailerChannel: null,
    trailerChannelId: null,
    trailerCandidateVideoId: trailerCandidate?.videoId ?? null,
    trailerCandidateOfficial: trailerCandidate?.officialCandidate === true,
    trailerCandidateEmbeddable: trailerCandidate?.embeddable === true,
    trailerCandidateChannel: trailerCandidate?.channelTitle ?? null,
    trailerOfficial: false,
    trailerVerifiedAt: null,
    trailerStatus,
    candidateVideos: candidates
  };
}

async function syncMovie(movie) {
  const previous = existingTrailerData[movie.id];
  const verifiedAt = Date.parse(previous?.trailerVerifiedAt ?? "");
  const verificationIsFresh = Number.isFinite(verifiedAt)
    && Date.now() - verifiedAt < verificationTtlMs;
  if (previous?.trailerStatus === "verified" && verificationIsFresh && !refreshVerified) return previous;
  if (previous && previous.trailerStatus !== "verified" && !retryUnverified) return previous;

  const tmdbSearch = await searchTmdbMovie(movie);
  if (!tmdbSearch.match) {
    const status = tmdbSearch.candidates.length ? "needs_review" : "not_found";
    const candidates = tmdbSearch.candidates.slice(0, 10).map((candidate) => ({
      tmdbId: candidate.id,
      title: candidate.title,
      originalTitle: candidate.original_title,
      releaseDate: candidate.release_date ?? null,
      reason: "TMDB result did not uniquely match the movie title and release year."
    }));
    return createBaseRecord(movie, null, status, candidates);
  }

  const tmdbMovie = tmdbSearch.match;
  const [tmdbVideos, youtubeVideos] = await Promise.all([
    getTmdbVideos(tmdbMovie.id, movie.id),
    searchYoutube(movie)
  ]);
  const candidatesById = new Map();
  for (const candidate of [...tmdbVideos, ...youtubeVideos]) {
    if (!candidate.videoId) continue;
    const existing = candidatesById.get(candidate.videoId);
    candidatesById.set(candidate.videoId, existing
      ? {
          ...existing,
          tmdbOfficial: existing.tmdbOfficial || candidate.tmdbOfficial,
          tmdbLinked: existing.tmdbLinked || candidate.tmdbLinked
        }
      : candidate);
  }

  const candidates = [...candidatesById.values()]
    .filter((candidate) => /^[\w-]{11}$/.test(candidate.videoId));
  const details = await getYoutubeVideoDetails(candidates.map((candidate) => candidate.videoId), movie.id);
  const reviewedCandidates = candidates.map((candidate) => {
    const video = details.get(candidate.videoId);
    const title = video?.snippet?.title ?? candidate.title;
    const channelId = video?.snippet?.channelId ?? candidate.channelId;
    const channelTitle = video?.snippet?.channelTitle ?? candidate.channelTitle;
    const yearMatches = title.includes(String(movie.year));
    const titleIsRelevant = titleMatches(movie, title) && isTrailerTitle(title) && !isDisallowedTitle(title);
    const trustedChannel = Boolean(channelId && trustedChannelIds.has(channelId));
    const isPublicAndEmbeddable = video?.status?.privacyStatus === "public"
      && video.status.embeddable === true;
    const officialEvidence = candidate.tmdbLinked && candidate.tmdbOfficial;
    const officialCandidate = Boolean(
      video
        && video.status?.privacyStatus === "public"
        && titleIsRelevant
        && trustedChannel
        && (officialEvidence || yearMatches)
    );
    const verified = Boolean(isPublicAndEmbeddable && officialCandidate);

    return {
      ...candidate,
      title,
      channelTitle: channelTitle ?? null,
      channelId: channelId ?? null,
      embeddable: video?.status?.embeddable === true,
      public: video?.status?.privacyStatus === "public",
      trustedChannel,
      officialCandidate,
      verified,
      reason: verified
        ? "Matched title/year, public embeddable status, official source evidence, and trusted channel."
        : !trustedChannel
          ? "Requires review: confirm the uploader is an official studio or distributor channel."
          : !titleIsRelevant || !(officialEvidence || yearMatches)
            ? "Requires review: confirm the exact film, release year, and official trailer."
            : "Official-source candidate found, but the video must be public and embeddable to play here."
    };
  });

  const officialCandidates = reviewedCandidates
    .filter((candidate) => candidate.officialCandidate)
    .sort((left, right) => trailerPriority(left.title) - trailerPriority(right.title));
  const bestCandidatePriority = officialCandidates.length
    ? trailerPriority(officialCandidates[0].title)
    : Number.POSITIVE_INFINITY;
  const equallyRankedCandidates = officialCandidates.filter(
    (candidate) => trailerPriority(candidate.title) === bestCandidatePriority
  );
  const trailerCandidate = equallyRankedCandidates.length === 1 ? equallyRankedCandidates[0] : null;

  const eligible = reviewedCandidates
    .filter((candidate) => candidate.verified)
    .sort((left, right) => trailerPriority(left.title) - trailerPriority(right.title));
  const bestPriority = eligible.length ? trailerPriority(eligible[0].title) : Number.POSITIVE_INFINITY;
  const equallyRanked = eligible.filter((candidate) => trailerPriority(candidate.title) === bestPriority);
  const best = equallyRanked.length === 1 ? equallyRanked[0] : null;

  if (!best) {
    return createBaseRecord(
      movie,
      tmdbMovie,
      reviewedCandidates.length ? "needs_review" : "not_found",
      reviewedCandidates.slice(0, 20),
      trailerCandidate
    );
  }

  return {
    ...createBaseRecord(movie, tmdbMovie, "verified", [], best),
    trailerVideoId: best.videoId,
    trailerTitle: best.title,
    trailerSourceUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(best.videoId)}`,
    trailerDiscoverySource: best.tmdbLinked ? "TMDB Videos + YouTube Data API" : "YouTube Data API",
    trailerChannel: best.channelTitle,
    trailerChannelId: best.channelId,
    trailerOfficial: true,
    trailerVerifiedAt: new Date().toISOString().slice(0, 10),
    candidateVideos: reviewedCandidates.slice(0, 20)
  };
}

async function main() {
  if (!trustedChannelIds.size) {
    console.warn("TRUSTED_YOUTUBE_CHANNEL_IDS is empty; discovered trailers will remain needs_review.");
  }

  const nextTrailerData = { ...existingTrailerData };
  for (const movie of movies) nextTrailerData[movie.id] = await syncMovie(movie);
  clearDuplicatedVideoSelections(nextTrailerData, movies);

  const output = `export const trailerData = ${JSON.stringify(nextTrailerData, null, 2)};\n`;
  const temporaryPath = `${outputPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, output, { encoding: "utf8", flag: "wx" });
  try {
    await rename(temporaryPath, outputPath);
  } catch (error) {
    await unlink(temporaryPath);
    throw error;
  }

  console.log("Movie | Movie year | Source | Status | Matched title | TMDB release date | Channel | Video ID");
  for (const movie of movies) {
    const record = nextTrailerData[movie.id];
    const candidate = record.candidateVideos?.[0];
    console.log([
      movie.title,
      movie.year,
      record.trailerDiscoverySource ?? candidate?.source ?? (candidate?.tmdbId ? "TMDB search" : "—"),
      record.trailerStatus,
      record.trailerTitle ?? candidate?.title ?? candidate?.originalTitle ?? "—",
      record.tmdbReleaseDate ?? candidate?.releaseDate ?? "—",
      record.trailerChannel ?? candidate?.channelTitle ?? "—",
      record.trailerVideoId ?? "—",
    ].join(" | "));
  }
  console.log(`Saved trailer metadata for ${movies.length} movies to js/trailer-data.js.`);
}

main().catch((error) => {
  console.error("Trailer synchronization failed; existing data was not replaced.", error);
  process.exitCode = 1;
});
