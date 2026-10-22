import { movies } from "./movies.js";
import { CommunityStore, summarizeRatings } from "./community.js";

const elements = {
  catalog: document.querySelector("#catalog"),
  catalogTitle: document.querySelector("[data-catalog-title]"),
  grid: document.querySelector("[data-movie-grid]"),
  resultsCount: document.querySelector("[data-results-count]"),
  pagination: document.querySelector("[data-pagination]"),
  emptyState: document.querySelector("[data-empty-state]"),
  favoriteCount: document.querySelector("[data-favorite-count]"),
  searchInputs: [...document.querySelectorAll("[data-search]")],
  suggestions: document.querySelector("#movie-suggestions"),
  filters: [...document.querySelectorAll("[data-filter]")],
  sort: document.querySelector("[data-sort]"),
  pageSize: document.querySelector("[data-page-size]"),
  hero: document.querySelector(".hero-section"),
  heroBackdrop: document.querySelector("[data-hero-backdrop]"),
  heroKicker: document.querySelector("[data-hero-kicker]"),
  heroTitle: document.querySelector("[data-hero-title]"),
  heroMeta: document.querySelector("[data-hero-meta]"),
  heroDescription: document.querySelector("[data-hero-description]"),
  heroDots: document.querySelector("[data-hero-dots]"),
  dialog: document.querySelector("[data-movie-dialog]"),
  dialogContent: document.querySelector("[data-dialog-content]"),
  toastRegion: document.querySelector("[data-toast-region]"),
  nav: document.querySelector(".primary-nav"),
  menuToggle: document.querySelector('[data-action="menu"]'),
  favoriteFilter: document.querySelector('[data-filter="favorites"]'),
  clearSearch: document.querySelector('[data-action="clear-search"]')
};

const movieById = new Map(movies.map((movie) => [movie.id, movie]));
const heroMovieIds = ["the-dark-knight", "parasite", "inception", "interstellar", "get-out"];
const heroMovies = heroMovieIds.map((id) => movieById.get(id)).filter(Boolean);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const state = {
  query: "",
  genre: "",
  year: "",
  critics: "",
  audience: "",
  era: "",
  favoritesOnly: false,
  sort: "featured",
  pageSize: 10,
  page: 1,
  activeHero: 0,
  heroManuallyPaused: false,
  heroHovered: false,
  heroFocused: false,
  storageAvailable: true,
  commentSort: "newest",
  commentQuery: "",
  commentFilter: "all",
  commentPageSize: 10,
  commentPage: 1,
  editingCommentId: null,
  revealedSpoilers: new Set(),
  activeDialogMovieId: null
};

let searchTimer;
let heroTimer;
let lastFocusedElement = null;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[character];
  });
}

function normalizeText(value) {
  return String(value ?? "")
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.className = `toast${isError ? " is-error" : ""}`;
  toast.setAttribute("role", isError ? "alert" : "status");
  toast.textContent = message;
  elements.toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 3600);
}

function readFavorites() {
  try {
    const storedValue = localStorage.getItem("khung-hinh:favorites");
    if (!storedValue) return new Set();
    const ids = JSON.parse(storedValue);
    if (!Array.isArray(ids)) throw new TypeError("Favorites storage must contain an array.");
    return new Set(ids.filter((id) => movieById.has(id)));
  } catch (error) {
    state.storageAvailable = false;
    console.error("Could not read saved favorites from localStorage.", error);
    return new Set();
  }
}

const favorites = readFavorites();
let communityStore = null;

try {
  communityStore = new CommunityStore();
} catch (error) {
  console.error("Could not load community ratings and comments from localStorage.", error);
  showToast("Không thể đọc dữ liệu đánh giá và bình luận trên trình duyệt này.", true);
}

function saveFavorites() {
  try {
    localStorage.setItem("khung-hinh:favorites", JSON.stringify([...favorites]));
    state.storageAvailable = true;
    return true;
  } catch (error) {
    state.storageAvailable = false;
    console.error("Could not save favorites to localStorage.", error);
    showToast("Không thể lưu yêu thích trên trình duyệt này. Danh sách chỉ còn trong phiên hiện tại.", true);
    return false;
  }
}

function formatScore(score) {
  return Number.isFinite(score) ? `${score}%` : "Chưa có dữ liệu";
}

function getCommunitySummary(movieId) {
  if (!communityStore) return { rating: null, average: null, count: 0, comments: [] };
  const { rating, comments } = communityStore.getMovieData(movieId);
  const ratings = communityStore.data.ratings.filter((item) => item.movieId === movieId);
  const average = ratings.length
    ? ratings.reduce((sum, item) => sum + item.score, 0) / ratings.length
    : null;
  return { rating, average, count: ratings.length, comments };
}

function formatTenPointScore(score) {
  return Number.isFinite(score) ? `${score.toFixed(1)}/10` : "Chưa có dữ liệu";
}

function youtubeVideoId(value) {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be" || url.hostname === "www.youtu.be") {
      const shortId = url.pathname.slice(1);
      return /^[\w-]{11}$/.test(shortId) ? shortId : null;
    }
    if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) return null;
    const videoId = url.searchParams.get("v") ?? url.pathname.match(/^\/embed\/([\w-]{11})$/)?.[1];
    return videoId && /^[\w-]{11}$/.test(videoId) ? videoId : null;
  } catch (error) {
    if (error instanceof TypeError) return null;
    throw error;
  }
}

function isYoutubeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"].includes(url.hostname);
  } catch (error) {
    if (error instanceof TypeError) return false;
    throw error;
  }
}

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch (error) {
    if (error instanceof TypeError) return null;
    throw error;
  }
}

function scoreMarkup(movie) {
  const community = getCommunitySummary(movie.id);
  const scores = summarizeRatings(movie, community.average);
  return `
    <div class="score-list">
      <div class="score-row">
        <span>🍅 Chuyên gia</span>
        <strong>${escapeHtml(formatScore(movie.ratings?.critics))}</strong>
      </div>
      <div class="score-row">
        <span>🍿 Khán giả RT</span>
        <strong>${escapeHtml(formatScore(movie.externalAudienceScore))}</strong>
      </div>
      <div class="score-row score-row-combined">
        <span>⭐ Khán giả tổng hợp</span>
        <strong>${escapeHtml(formatTenPointScore(scores.combinedScore))}</strong>
      </div>
      <div class="score-source">
        <a href="${escapeHtml(movie.ratingUrl)}" target="_blank" rel="noreferrer">Rotten Tomatoes · ${escapeHtml(movie.externalAudienceVerifiedAt)}</a>
      </div>
    </div>`;
}

function cardMarkup(movie) {
  const isFavorite = favorites.has(movie.id);
  const genres = movie.genres.map((genre) => `<span class="genre-chip">${escapeHtml(genre)}</span>`).join("");

  return `
    <article class="movie-card" data-movie-card data-movie-id="${escapeHtml(movie.id)}">
      <div class="movie-card-scene">
        <div class="movie-card-face movie-card-front">
          <div class="poster-shell">
            <button
              class="poster-flip"
              type="button"
              data-action="flip"
              data-movie-id="${escapeHtml(movie.id)}"
              aria-label="Lật thẻ phim ${escapeHtml(movie.title)}"
              aria-pressed="false"
            >
              <img src="${escapeHtml(movie.poster)}" alt="Poster phim ${escapeHtml(movie.title)}" loading="lazy" decoding="async">
            </button>
            <span class="media-fallback" aria-hidden="true">${escapeHtml(movie.title)}</span>
            <span class="flip-hint" aria-hidden="true">↻ Xem mặt sau</span>
            <button
              class="favorite-toggle${isFavorite ? " is-favorite" : ""}"
              type="button"
              data-action="favorite"
              data-movie-id="${escapeHtml(movie.id)}"
              aria-label="${isFavorite ? "Xóa khỏi" : "Thêm vào"} yêu thích: ${escapeHtml(movie.title)}"
              aria-pressed="${isFavorite}"
            >${isFavorite ? "♥" : "♡"}</button>
          </div>
          <div class="movie-card-info">
            <h3 class="movie-card-title">${escapeHtml(movie.title)}</h3>
            <p class="movie-card-year">${movie.year}</p>
            ${scoreMarkup(movie)}
          </div>
        </div>
        <div class="movie-card-face movie-card-back" aria-label="Thông tin phim ${escapeHtml(movie.title)}" aria-hidden="true" inert>
          <p class="back-label">Trong bộ sưu tập</p>
          <h3>${escapeHtml(movie.title)}</h3>
          <p class="back-year">${movie.year} · ${movie.runtime} phút</p>
          <p class="back-summary">${escapeHtml(movie.shortOverview)}</p>
          <div class="genre-list">${genres}</div>
          <div class="back-details">
            <div class="back-detail"><span>Đạo diễn</span><span>${escapeHtml(movie.director)}</span></div>
            <div class="back-detail"><span>Quốc gia</span><span>${escapeHtml(movie.country)}</span></div>
            <div class="back-detail"><span>Diễn viên</span><span>${escapeHtml(movie.cast.slice(0, 2).join(", "))}</span></div>
          </div>
          <div class="back-actions">
            <button class="button button-primary" type="button" data-action="play-trailer" data-movie-id="${escapeHtml(movie.id)}">
              <span aria-hidden="true">▶</span> Xem trailer
            </button>
            <button class="button button-glass" type="button" data-action="details" data-movie-id="${escapeHtml(movie.id)}">Xem chi tiết</button>
            <button class="button button-glass" type="button" data-action="flip" data-movie-id="${escapeHtml(movie.id)}" aria-label="Lật lại mặt trước">Quay lại</button>
          </div>
        </div>
      </div>
    </article>`;
}

function getFilteredMovies() {
  const query = normalizeText(state.query);
  let result = movies.filter((movie) => {
    const matchesQuery = !query || normalizeText(`${movie.title} ${movie.originalTitle}`).includes(query);
    const matchesGenre = !state.genre || movie.genres.includes(state.genre);
    const matchesYear = !state.year || movie.year === Number(state.year);
    const matchesEra = !state.era
      || (state.era === "classics" && movie.year < 2000)
      || (state.era === "recent" && movie.year >= 2015);
    const matchesCritics = !state.critics || (Number.isFinite(movie.ratings?.critics) && movie.ratings.critics >= Number(state.critics));
    const matchesAudience = !state.audience || (Number.isFinite(movie.ratings?.audience) && movie.ratings.audience >= Number(state.audience));
    const matchesFavorites = !state.favoritesOnly || favorites.has(movie.id);
    return matchesQuery && matchesGenre && matchesYear && matchesEra && matchesCritics && matchesAudience && matchesFavorites;
  });

  const titleCompare = (left, right) => left.title.localeCompare(right.title, "vi", { sensitivity: "base" });
  switch (state.sort) {
    case "title-asc":
      result = [...result].sort(titleCompare);
      break;
    case "title-desc":
      result = [...result].sort((left, right) => titleCompare(right, left));
      break;
    case "newest":
      result = [...result].sort((left, right) => right.year - left.year || titleCompare(left, right));
      break;
    case "oldest":
      result = [...result].sort((left, right) => left.year - right.year || titleCompare(left, right));
      break;
    case "critics":
      result = [...result].sort((left, right) => {
        const leftScore = left.ratings?.critics;
        const rightScore = right.ratings?.critics;
        if (!Number.isFinite(leftScore)) return Number.isFinite(rightScore) ? 1 : titleCompare(left, right);
        if (!Number.isFinite(rightScore)) return -1;
        return rightScore - leftScore || titleCompare(left, right);
      });
      break;
    case "audience":
      result = [...result].sort((left, right) => {
        const leftScore = left.ratings?.audience;
        const rightScore = right.ratings?.audience;
        if (!Number.isFinite(leftScore)) return Number.isFinite(rightScore) ? 1 : titleCompare(left, right);
        if (!Number.isFinite(rightScore)) return -1;
        return rightScore - leftScore || titleCompare(left, right);
      });
      break;
    default:
      break;
  }
  return result;
}

function renderCatalog() {
  const filtered = getFilteredMovies();
  const pageCount = state.pageSize === "all" ? 1 : Math.max(1, Math.ceil(filtered.length / state.pageSize));
  state.page = Math.min(state.page, pageCount);
  const start = state.pageSize === "all" ? 0 : (state.page - 1) * state.pageSize;
  const visibleMovies = state.pageSize === "all" ? filtered : filtered.slice(start, start + state.pageSize);

  elements.grid.innerHTML = visibleMovies.map(cardMarkup).join("");
  elements.grid.hidden = visibleMovies.length === 0;
  elements.emptyState.hidden = visibleMovies.length !== 0;
  elements.resultsCount.innerHTML = `Hiển thị <strong>${visibleMovies.length ? start + 1 : 0}–${start + visibleMovies.length}</strong> trong <strong>${filtered.length}</strong> phim`;
  elements.pagination.innerHTML = paginationMarkup(pageCount);
  elements.favoriteCount.textContent = String(favorites.size);
  elements.favoriteFilter.checked = state.favoritesOnly;
  elements.catalogTitle.innerHTML = state.favoritesOnly
    ? 'Danh sách <span>yêu thích</span>'
    : 'Khám phá <span>điện ảnh</span>';
}

function paginationMarkup(pageCount) {
  if (pageCount <= 1 || state.pageSize === "all") return "";
  const previousDisabled = state.page <= 1 ? " disabled" : "";
  const nextDisabled = state.page >= pageCount ? " disabled" : "";
  const pages = new Set([1, pageCount, state.page - 1, state.page, state.page + 1].filter((page) => page > 0 && page <= pageCount));
  const sortedPages = [...pages].sort((left, right) => left - right);
  const pageButtons = [];
  let previousPage = 0;

  for (const page of sortedPages) {
    if (page - previousPage > 1) pageButtons.push('<span class="page-summary" aria-hidden="true">…</span>');
    pageButtons.push(`<button type="button" data-action="page" data-page="${page}"${page === state.page ? ' aria-current="page"' : ""} aria-label="Trang ${page}">${page}</button>`);
    previousPage = page;
  }

  return `
    <button type="button" data-action="previous-page" aria-label="Trang trước"${previousDisabled}>←</button>
    ${pageButtons.join("")}
    <span class="page-summary">Trang ${state.page} / ${pageCount}</span>
    <button type="button" data-action="next-page" aria-label="Trang tiếp theo"${nextDisabled}>→</button>`;
}

function setSearchSuggestions(query) {
  const normalized = normalizeText(query);
  const suggestions = movies
    .filter((movie) => !normalized || normalizeText(`${movie.title} ${movie.originalTitle}`).includes(normalized))
    .slice(0, 8);
  elements.suggestions.innerHTML = suggestions
    .map((movie) => `<option value="${escapeHtml(movie.title)}"></option>`)
    .join("");
}

function populateFilters() {
  const genres = [...new Set(movies.flatMap((movie) => movie.genres))].sort((left, right) => left.localeCompare(right, "vi"));
  const years = [...new Set(movies.map((movie) => movie.year))].sort((left, right) => right - left);
  const genreSelect = document.querySelector('[data-filter="genre"]');
  const yearSelect = document.querySelector('[data-filter="year"]');
  genreSelect.insertAdjacentHTML("beforeend", genres.map((genre) => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`).join(""));
  yearSelect.insertAdjacentHTML("beforeend", years.map((year) => `<option value="${year}">${year}</option>`).join(""));
}

function renderHero() {
  const movie = heroMovies[state.activeHero];
  if (!movie) return;

  elements.heroBackdrop.src = movie.poster;
  elements.heroBackdrop.alt = "";
  elements.heroKicker.textContent = `${movie.genres.slice(0, 2).join(" · ")}  /  ${movie.year}`;
  elements.heroTitle.textContent = movie.title;
  elements.heroMeta.innerHTML = `
    <span>${movie.year}</span>
    <span>${movie.runtime} phút</span>
    <span class="hero-rating">🍅 ${formatScore(movie.ratings.critics)}</span>
    <span>🍿 ${formatScore(movie.ratings.audience)}</span>`;
  elements.heroDescription.textContent = movie.summary;
  elements.heroDots.innerHTML = heroMovies.map((heroMovie, index) => `
    <button
      class="hero-dot${index === state.activeHero ? " is-active" : ""}"
      type="button"
      data-action="hero-slide"
      data-slide="${index}"
      aria-label="Chọn phim nổi bật: ${escapeHtml(heroMovie.title)}"
      aria-current="${index === state.activeHero}"
    ></button>`).join("");

  const favoriteButton = document.querySelector('[data-action="hero-favorite"]');
  const isFavorite = favorites.has(movie.id);
  favoriteButton.innerHTML = `<span aria-hidden="true">${isFavorite ? "♥" : "＋"}</span> ${isFavorite ? "Đã yêu thích" : "Thêm yêu thích"}`;
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
}

function moveHero(offset) {
  state.activeHero = (state.activeHero + offset + heroMovies.length) % heroMovies.length;
  renderHero();
}

function updateHeroTimer() {
  window.clearInterval(heroTimer);
  if (reducedMotion.matches || state.heroManuallyPaused || state.heroHovered || state.heroFocused || heroMovies.length < 2) return;
  heroTimer = window.setInterval(() => moveHero(1), 7000);
}

function setHeroPaused(paused) {
  state.heroManuallyPaused = paused;
  const pauseButton = document.querySelector('[data-action="hero-pause"]');
  pauseButton.setAttribute("aria-pressed", String(paused));
  pauseButton.setAttribute("aria-label", paused ? "Tiếp tục tự chuyển" : "Tạm dừng tự chuyển");
  pauseButton.textContent = paused ? "▶" : "Ⅱ";
  updateHeroTimer();
}

function commentDate(dateValue) {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime())
    ? "Thời gian không hợp lệ"
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function ratingDashboardMarkup(movie, community) {
  const scores = summarizeRatings(movie, community.average);
  return `
    <section class="community-section rating-dashboard" aria-labelledby="rating-dashboard-title">
      <div class="community-heading">
        <div>
          <p class="eyebrow"><span class="eyebrow-line"></span> ĐIỂM ĐÁNH GIÁ</p>
          <h3 id="rating-dashboard-title">Điểm phim</h3>
        </div>
        <button class="score-method" type="button" data-action="combined-info" aria-label="Cách tính điểm khán giả tổng hợp">ⓘ Cách tính</button>
      </div>
      <div class="rating-dashboard-grid">
        <div class="dialog-rating">
          <span>Chuyên gia · ${escapeHtml(movie.criticScoreSource)}</span>
          <strong>${escapeHtml(formatScore(movie.ratings?.critics))}</strong>
          <small>Thang ${escapeHtml(movie.criticScoreScale)}</small>
        </div>
        <div class="dialog-rating">
          <span>Khán giả bên ngoài · ${escapeHtml(movie.externalAudienceSource)}</span>
          <strong>${escapeHtml(formatScore(movie.externalAudienceScore))}</strong>
          <small>${Number.isFinite(movie.externalAudienceScore)
            ? `${escapeHtml(scores.externalScore.toFixed(1))}/10 · kiểm tra ${escapeHtml(movie.externalAudienceVerifiedAt)}`
            : "Chưa có dữ liệu"}</small>
        </div>
        <div class="dialog-rating">
          <span>Cộng đồng website · bản demo cục bộ</span>
          <strong>${escapeHtml(formatTenPointScore(scores.websiteScore))}</strong>
          <small>${community.count} lượt đánh giá trên trình duyệt này</small>
        </div>
        <div class="dialog-rating dialog-rating-combined">
          <span>Khán giả tổng hợp · chỉ số của Khung Hình</span>
          <strong>${escapeHtml(formatTenPointScore(scores.combinedScore))}</strong>
          <small>${scores.combinedScore === null
            ? "Cần cả điểm bên ngoài và điểm cộng đồng"
            : "Trung bình 50/50 của hai điểm khán giả"}</small>
        </div>
      </div>
    </section>
    <form class="rating-form" data-rating-form data-movie-id="${escapeHtml(movie.id)}">
      <fieldset>
        <legend>${community.rating ? "Cập nhật đánh giá của bạn" : "Bạn đánh giá bộ phim này thế nào?"}</legend>
        <div class="rating-choice-list">
          ${Array.from({ length: 10 }, (_, index) => index + 1).map((score) => `
            <label class="rating-choice" aria-label="${score} trên 10">
              <input type="radio" name="user-rating" value="${score}"${community.rating?.score === score ? " checked" : ""} required>
              <span aria-hidden="true">★<small>${score}</small></span>
            </label>`).join("")}
        </div>
      </fieldset>
      <div class="rating-submit-row">
        <span data-rating-selection aria-live="polite">${community.rating
          ? `Điểm đã chọn: ${community.rating.score}/10`
          : "Chọn điểm từ 1 đến 10"}</span>
        <button class="button button-primary" type="submit">Gửi đánh giá</button>
      </div>
      <p class="local-demo-notice">Bản demo: đánh giá chỉ lưu trên trình duyệt hiện tại, không đại diện cho tài khoản.</p>
    </form>`;
}

function commentsMarkup(movie, community) {
  const normalizedQuery = normalizeText(state.commentQuery);
  const comments = community.comments.filter((comment) => {
    const matchesQuery = !normalizedQuery || normalizeText(comment.content).includes(normalizedQuery);
    const matchesSpoiler = state.commentFilter === "all"
      || (state.commentFilter === "spoiler" && comment.isSpoiler)
      || (state.commentFilter === "no-spoiler" && !comment.isSpoiler);
    return matchesQuery && matchesSpoiler;
  });
  if (state.commentSort === "oldest") {
    comments.sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt));
  } else if (state.commentSort === "likes") {
    comments.sort((left, right) => right.likeCount - left.likeCount || Date.parse(right.createdAt) - Date.parse(left.createdAt));
  } else {
    comments.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  }

  const pageCount = state.commentPageSize === "all"
    ? 1
    : Math.max(1, Math.ceil(comments.length / state.commentPageSize));
  state.commentPage = Math.min(state.commentPage, pageCount);
  const start = state.commentPageSize === "all" ? 0 : (state.commentPage - 1) * state.commentPageSize;
  const visibleComments = state.commentPageSize === "all"
    ? comments
    : comments.slice(start, start + state.commentPageSize);
  const editingComment = visibleComments.find((comment) => comment.id === state.editingCommentId)
    ?? community.comments.find((comment) => comment.id === state.editingCommentId);
  const commentList = visibleComments.length
    ? visibleComments.map((comment) => {
      const isRevealed = state.revealedSpoilers.has(comment.id);
      const hiddenContent = comment.isSpoiler && !isRevealed;
      const editedLabel = comment.updatedAt !== comment.createdAt ? " · đã chỉnh sửa" : "";
      return `
        <article class="comment-card" data-comment-id="${escapeHtml(comment.id)}">
          <div class="comment-heading">
            <div class="comment-author">
              <span class="comment-avatar" aria-hidden="true">K</span>
              <span><strong>Bạn</strong><small>Trên trình duyệt này · ${escapeHtml(commentDate(comment.createdAt))}${editedLabel}</small></span>
            </div>
            ${community.rating ? `<span class="comment-rating">★ ${community.rating.score}/10</span>` : ""}
          </div>
          ${comment.isSpoiler ? `
            <div class="spoiler-warning">
              <span>${hiddenContent ? "Bình luận có tiết lộ nội dung phim." : "Spoiler đã được mở."}</span>
              <button class="text-button" type="button" data-action="reveal-spoiler" data-comment-id="${escapeHtml(comment.id)}">
                ${hiddenContent ? "Nhấn để xem" : "Ẩn lại"}
              </button>
            </div>` : ""}
          <p class="comment-content${hiddenContent ? " is-hidden" : ""}">${hiddenContent ? "Nội dung đã được ẩn." : escapeHtml(comment.content)}</p>
          <div class="comment-actions">
            <button class="text-button" type="button" data-action="like-comment" data-comment-id="${escapeHtml(comment.id)}" aria-pressed="${comment.liked}">
              ${comment.liked ? "♥ Đã thích" : "♡ Thích"} · ${comment.likeCount}
            </button>
            <button class="text-button" type="button" data-action="report-comment" data-comment-id="${escapeHtml(comment.id)}">
              Báo cáo${comment.reportCount ? ` · ${comment.reportCount}` : ""}
            </button>
            <button class="text-button" type="button" data-action="edit-comment" data-comment-id="${escapeHtml(comment.id)}">Sửa</button>
            <button class="text-button" type="button" data-action="delete-comment" data-comment-id="${escapeHtml(comment.id)}">Xóa</button>
          </div>
        </article>`;
    }).join("")
    : `<p class="empty-comments">${community.comments.length
      ? "Không có bình luận phù hợp với tìm kiếm hoặc bộ lọc."
      : "Chưa có bình luận nào cho phim này trên trình duyệt hiện tại."}</p>`;

  return `
    <section class="community-section comments-section" aria-labelledby="comments-title">
      <div class="community-heading">
        <div>
          <p class="eyebrow"><span class="eyebrow-line"></span> CỘNG ĐỒNG</p>
          <h3 id="comments-title">Bình luận của khán giả <span>(${community.comments.length})</span></h3>
        </div>
      </div>
      <div class="comment-filter-controls">
        <label class="visually-hidden" for="comment-search">Tìm trong bình luận phim ${escapeHtml(movie.title)}</label>
        <input id="comment-search" type="search" data-action="comment-search" value="${escapeHtml(state.commentQuery)}" placeholder="Tìm trong bình luận...">
        <label class="comment-control-label">Lọc
          <select data-action="comment-filter" aria-label="Lọc bình luận theo spoiler">
            <option value="all"${state.commentFilter === "all" ? " selected" : ""}>Tất cả</option>
            <option value="spoiler"${state.commentFilter === "spoiler" ? " selected" : ""}>Có spoiler</option>
            <option value="no-spoiler"${state.commentFilter === "no-spoiler" ? " selected" : ""}>Không spoiler</option>
          </select>
        </label>
        <label class="comment-control-label">Sắp xếp
          <select data-action="comment-sort" aria-label="Sắp xếp bình luận">
            <option value="newest"${state.commentSort === "newest" ? " selected" : ""}>Mới nhất</option>
            <option value="oldest"${state.commentSort === "oldest" ? " selected" : ""}>Cũ nhất</option>
            <option value="likes"${state.commentSort === "likes" ? " selected" : ""}>Nhiều lượt thích</option>
          </select>
        </label>
        <label class="comment-control-label">Hiển thị
          <select data-action="comment-page-size" aria-label="Số bình luận mỗi trang">
            <option value="10"${state.commentPageSize === 10 ? " selected" : ""}>10</option>
            <option value="20"${state.commentPageSize === 20 ? " selected" : ""}>20</option>
            <option value="50"${state.commentPageSize === 50 ? " selected" : ""}>50</option>
            <option value="all"${state.commentPageSize === "all" ? " selected" : ""}>Tất cả</option>
          </select>
        </label>
      </div>
      <div class="comment-list">${commentList}</div>
      <nav class="comment-pagination" aria-label="Phân trang bình luận">
        <span>Hiển thị ${visibleComments.length ? `${start + 1}–${start + visibleComments.length}` : "0"} trong ${comments.length}</span>
        ${pageCount > 1 ? `
          <button type="button" data-action="comment-page" data-page="${Math.max(1, state.commentPage - 1)}"${state.commentPage === 1 ? " disabled" : ""} aria-label="Bình luận trước">←</button>
          <span>Trang ${state.commentPage} / ${pageCount}</span>
          <button type="button" data-action="comment-page" data-page="${Math.min(pageCount, state.commentPage + 1)}"${state.commentPage === pageCount ? " disabled" : ""} aria-label="Bình luận tiếp theo">→</button>` : ""}
      </nav>
      <form class="comment-form" data-comment-form data-movie-id="${escapeHtml(movie.id)}" data-editing-id="${escapeHtml(editingComment?.id ?? "")}">
        <label for="comment-input">${editingComment ? "Chỉnh sửa bình luận" : "Viết bình luận"}</label>
        <textarea id="comment-input" name="comment" maxlength="1000" rows="4" required placeholder="Chia sẻ cảm nhận của bạn...">${escapeHtml(editingComment?.content ?? "")}</textarea>
        <div class="comment-form-meta">
          <label class="spoiler-checkbox"><input type="checkbox" name="is-spoiler"${editingComment?.isSpoiler ? " checked" : ""}> Đánh dấu bình luận có tiết lộ nội dung phim</label>
          <span data-comment-counter aria-live="polite">${editingComment?.content.length ?? 0}/1000</span>
        </div>
        <div class="comment-submit-row">
          <p class="local-demo-notice">Bản demo cục bộ: bình luận chỉ lưu ở trình duyệt này; thao tác thích/báo cáo cũng không được gửi tới máy chủ.</p>
          <div>
            ${editingComment ? '<button class="button button-glass" type="button" data-action="cancel-edit">Hủy</button>' : ""}
            <button class="button button-primary" type="submit">${editingComment ? "Lưu chỉnh sửa" : "Gửi bình luận"}</button>
          </div>
        </div>
      </form>
    </section>`;
}

function openMovieDetails(movieId, trigger = document.activeElement) {
  const movie = movieById.get(movieId);
  if (!movie) {
    showToast("Không tìm thấy thông tin phim.", true);
    return;
  }

  if (!elements.dialog.open) {
    lastFocusedElement = trigger instanceof HTMLElement ? trigger : null;
  }
  if (state.activeDialogMovieId !== movieId) {
    state.editingCommentId = null;
    state.revealedSpoilers.clear();
    state.commentSort = "newest";
    state.commentQuery = "";
    state.commentFilter = "all";
    state.commentPageSize = 10;
    state.commentPage = 1;
  }
  state.activeDialogMovieId = movieId;
  const related = movies
    .filter((candidate) => candidate.id !== movie.id && candidate.genres.some((genre) => movie.genres.includes(genre)))
    .sort((left, right) => {
      const leftOverlap = left.genres.filter((genre) => movie.genres.includes(genre)).length;
      const rightOverlap = right.genres.filter((genre) => movie.genres.includes(genre)).length;
      return rightOverlap - leftOverlap;
    })
    .slice(0, 1);
  const isFavorite = favorites.has(movie.id);
  const community = getCommunitySummary(movie.id);
  const introductionSource = httpsUrl(movie.officialIntroductionSource);
  const isVerifiedIntroduction = Boolean(
    introductionSource
    && movie.officialIntroductionVerifiedAt
    && ["official", "translated"].includes(movie.officialIntroductionType)
  );
  const introMarkup = movie.officialIntroduction
    ? `
      <p class="official-intro">${escapeHtml(movie.officialIntroduction).replace(/\n\n/g, "</p><p class=\"official-intro\">")}</p>
      <p class="introduction-source">${introductionSource
        ? `<a href="${escapeHtml(introductionSource)}" target="_blank" rel="noreferrer">Nguồn giới thiệu ↗</a>`
        : "Nguồn giới thiệu chưa được cung cấp"} · ${isVerifiedIntroduction && movie.officialIntroductionType === "translated"
          ? "Bản dịch từ giới thiệu chính thức"
          : movie.officialIntroductionType === "official" && isVerifiedIntroduction
            ? "Giới thiệu chính thức"
            : "Nội dung biên soạn hoặc chưa xác minh"}${isVerifiedIntroduction
              ? ` · xác minh ${escapeHtml(movie.officialIntroductionVerifiedAt)}`
              : ""}</p>`
    : '<p class="official-intro-unavailable">Chưa có lời giới thiệu chính thức được xác minh cho phim này. Nội dung giới thiệu sẽ được bổ sung khi có nguồn phù hợp.</p>';

  elements.dialogContent.innerHTML = `
    <img class="dialog-backdrop${movie.backdrop ? "" : " is-poster-fallback"}" src="${escapeHtml(movie.backdrop || movie.poster)}" alt="" decoding="async">
    <div class="dialog-backdrop-shade" aria-hidden="true"></div>
    <div class="dialog-body">
      <div class="dialog-poster-shell">
        <img src="${escapeHtml(movie.poster)}" alt="Poster phim ${escapeHtml(movie.title)}" decoding="async">
        <span class="media-fallback" aria-hidden="true">${escapeHtml(movie.title)}</span>
      </div>
      <div class="dialog-info">
        <p class="eyebrow"><span class="eyebrow-line"></span> CHI TIẾT PHIM</p>
        <h2 id="dialog-title">${escapeHtml(movie.title)}</h2>
        <p class="dialog-original-title">${escapeHtml(movie.originalTitle)}</p>
        <div class="dialog-meta">
          <span>${movie.year}</span><span>${movie.runtime} phút</span><span>${escapeHtml(movie.country)}</span>
        </div>
        <div class="genre-list">${movie.genres.map((genre) => `<span class="genre-chip">${escapeHtml(genre)}</span>`).join("")}</div>
        <p class="dialog-summary"><strong>Đạo diễn:</strong> ${escapeHtml(movie.director)}<br><strong>Diễn viên:</strong> ${escapeHtml(movie.cast.join(", "))}</p>
        <div class="dialog-actions">
          <button class="button button-glass" type="button" data-action="play-trailer" data-movie-id="${escapeHtml(movie.id)}">▶ Xem trailer</button>
          <button class="button button-primary" type="button" data-action="dialog-favorite" data-movie-id="${escapeHtml(movie.id)}" aria-pressed="${isFavorite}">
            ${isFavorite ? "♥ Đã yêu thích" : "♡ Thêm yêu thích"}
          </button>
        </div>
      </div>
      <div class="dialog-detail-sections">
        <section class="introduction-section" aria-labelledby="introduction-title">
          <h3 id="introduction-title">Giới thiệu phim</h3>
          ${introMarkup}
        </section>
        ${ratingDashboardMarkup(movie, community)}
        <a class="dialog-source" href="${escapeHtml(movie.ratingUrl)}" target="_blank" rel="noreferrer">
          Nguồn điểm đánh giá: Rotten Tomatoes · kiểm tra ${escapeHtml(movie.ratingCheckedAt)} ↗
        </a>
        ${commentsMarkup(movie, community)}
        ${related.length ? `
          <div class="related-section">
            <h3>Có thể bạn cũng thích</h3>
            <button class="related-link" type="button" data-action="details" data-movie-id="${escapeHtml(related[0].id)}">
              ${escapeHtml(related[0].title)} <span aria-hidden="true">↗</span>
            </button>
            <button class="button button-glass related-more" type="button" data-action="related-genre" data-genre="${escapeHtml(movie.genres[0])}">
              Khám phá thêm phim ${escapeHtml(movie.genres[0])}
            </button>
          </div>` : ""}
      </div>
    </div>`;

  if (!elements.dialog.open) {
    elements.dialog.showModal();
    document.body.classList.add("modal-open");
  }
  elements.dialog.querySelector("[data-action='close-dialog']").setAttribute("aria-label", "Đóng chi tiết phim");
  elements.dialog.querySelector("[data-action='close-dialog']").focus();
}

function openTrailer(movieId, trigger = document.activeElement) {
  const movie = movieById.get(movieId);
  if (!movie) {
    showToast("Không tìm thấy thông tin phim.", true);
    return;
  }
  if (!elements.dialog.open) {
    lastFocusedElement = trigger instanceof HTMLElement ? trigger : null;
  }

  const storedVideoId = movie.trailerVideoId;
  const videoId = typeof storedVideoId === "string" && /^[\w-]{11}$/.test(storedVideoId)
    ? storedVideoId
    : youtubeVideoId(movie.officialTrailerUrl);
  const sourceUrl = movie.trailerSourceUrl ?? movie.officialTrailerSource;
  const candidateSourceUrl = movie.trailerCandidateSourceUrl;
  const verifiedAt = movie.trailerVerifiedAt ?? movie.officialTrailerVerifiedAt;
  const hasVerificationStatus = movie.trailerStatus !== undefined;
  const verified = Boolean(
    videoId
      && isYoutubeUrl(sourceUrl)
      && verifiedAt
      && (!hasVerificationStatus || (movie.trailerStatus === "verified" && movie.trailerOfficial === true))
  );
  const unavailableMessage = movie.trailerStatus === "not_found"
    ? "Chưa tìm thấy trailer chính thức phù hợp cho phim này."
    : movie.trailerStatus === "needs_review"
      ? "Chưa có trailer được xác minh; cần rà soát tên phim và kênh phát hành."
      : "Chưa có trailer chính thức được xác minh cho phim này.";
  const candidateMessage = movie.trailerCandidateEmbeddable
    ? "Có trailer từ kênh chính thức nhưng cần kiểm tra thêm trước khi phát."
    : "Đã tìm thấy trailer từ kênh chính thức nhưng video không thể phát nhúng.";
  const returnToDetails = elements.dialog.open
    && state.activeDialogMovieId === movieId
    && Boolean(elements.dialogContent.querySelector(".dialog-body"));
  const videoMarkup = verified
    ? `
      <div class="trailer-frame">
        <iframe
          src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0"
          title="${escapeHtml(movie.title)} — Official Trailer"
          loading="eager"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <p class="trailer-help">Nếu trình duyệt chặn tự phát, hãy nhấn Play trong trình phát. Nếu video không thể nhúng, xem tại <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">nguồn chính thức ↗</a>.</p>`
    : movie.trailerCandidateOfficial && isYoutubeUrl(candidateSourceUrl)
      ? `
        <div class="trailer-unavailable" role="status">
          <span aria-hidden="true">▶</span>
          <p>${escapeHtml(candidateMessage)}</p>
          <small>${movie.trailerCandidateEmbeddable
            ? "Chỉ phát trailer sau khi dữ liệu được xác minh đầy đủ."
            : "Không phát video không cho phép nhúng."}</small>
        </div>
        <p class="trailer-help"><a href="${escapeHtml(candidateSourceUrl)}" target="_blank" rel="noreferrer">Xem tại nguồn chính thức ↗</a></p>`
    : `
      <div class="trailer-unavailable" role="status">
        <span aria-hidden="true">▶</span>
        <p>${escapeHtml(unavailableMessage)}</p>
        <small>Chúng tôi không phát video chưa rõ nguồn hoặc không đúng phiên bản phim.</small>
      </div>`;

  elements.dialogContent.innerHTML = `
    <section class="trailer-dialog-content" aria-labelledby="dialog-title">
      <p class="eyebrow"><span class="eyebrow-line"></span> ${verified ? "OFFICIAL TRAILER" : "TRAILER"}</p>
      <h2 id="dialog-title">${escapeHtml(movie.title)}</h2>
      <p class="trailer-version">${verified
        ? `Trailer đã xác minh · ${escapeHtml(verifiedAt)}`
        : "Nguồn trailer chưa được xác minh"}</p>
      ${videoMarkup}
      <div class="trailer-dialog-actions">
        ${returnToDetails
          ? `<button class="button button-glass" type="button" data-action="back-to-details" data-movie-id="${escapeHtml(movie.id)}">Quay lại chi tiết phim</button>`
          : ""}
      </div>
    </section>`;

  if (!elements.dialog.open) {
    elements.dialog.showModal();
    document.body.classList.add("modal-open");
  }
  elements.dialog.querySelector("[data-action='close-dialog']").setAttribute("aria-label", "Đóng trailer");
  elements.dialog.querySelector("[data-action='close-dialog']").focus();
}

function handleCommunityError(error, context) {
  console.error(context, error);
  showToast(error instanceof Error ? error.message : "Không thể lưu dữ liệu cộng đồng.", true);
}

function refreshOpenDetails(movieId, focusSelector) {
  renderCatalog();
  renderOpenDetails(movieId, focusSelector);
}

function renderOpenDetails(movieId, focusSelector) {
  const scrollTop = elements.dialog.scrollTop;
  openMovieDetails(movieId);
  elements.dialog.scrollTop = scrollTop;
  const focusTarget = focusSelector ? elements.dialogContent.querySelector(focusSelector) : null;
  focusTarget?.focus({ preventScroll: true });
}

function handleDialogSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (!form.matches("[data-rating-form], [data-comment-form]")) return;
  event.preventDefault();
  if (!communityStore) {
    showToast("Không thể dùng bộ nhớ đánh giá và bình luận trên trình duyệt này.", true);
    return;
  }

  const movieId = form.dataset.movieId;
  try {
    if (form.matches("[data-rating-form]")) {
      const selected = form.querySelector('input[name="user-rating"]:checked');
      if (!selected) {
        showToast("Hãy chọn điểm từ 1 đến 10 trước khi gửi.", true);
        return;
      }
      communityStore.setRating(movieId, Number(selected.value));
      refreshOpenDetails(movieId, `input[name="user-rating"][value="${selected.value}"]`);
      showToast("Đã lưu đánh giá trên trình duyệt này.");
      return;
    }

    const textarea = form.querySelector('textarea[name="comment"]');
    const content = textarea.value.trim();
    if (!content) {
      textarea.focus();
      showToast("Bình luận không được để trống.", true);
      return;
    }
    if (content.length > 1000) {
      textarea.focus();
      showToast("Bình luận không được vượt quá 1.000 ký tự.", true);
      return;
    }

    const editingId = form.dataset.editingId;
    if (editingId) {
      communityStore.editComment(editingId, content, form.elements["is-spoiler"].checked);
      state.editingCommentId = null;
      refreshOpenDetails(movieId, "[data-comment-form] textarea");
      showToast("Đã cập nhật bình luận trên trình duyệt này.");
    } else {
      communityStore.addComment(movieId, content, form.elements["is-spoiler"].checked);
      state.revealedSpoilers.clear();
      state.commentSort = "newest";
      state.commentQuery = "";
      state.commentFilter = "all";
      state.commentPage = 1;
      refreshOpenDetails(movieId, "[data-comment-form] textarea");
      showToast("Đã lưu bình luận trên trình duyệt này.");
    }
  } catch (error) {
    handleCommunityError(error, "Could not save community content to localStorage.");
  }
}

function toggleFavorite(movieId, trigger) {
  if (!movieById.has(movieId)) return;
  if (favorites.has(movieId)) {
    favorites.delete(movieId);
    showToast("Đã xóa phim khỏi danh sách yêu thích.");
  } else {
    favorites.add(movieId);
    showToast("Đã thêm phim vào danh sách yêu thích.");
  }
  saveFavorites();
  renderCatalog();
  renderHero();

  const dialogFavorite = elements.dialogContent.querySelector(`[data-action="dialog-favorite"][data-movie-id="${movieId}"]`);
  if (dialogFavorite) {
    const isFavorite = favorites.has(movieId);
    dialogFavorite.setAttribute("aria-pressed", String(isFavorite));
    dialogFavorite.textContent = isFavorite ? "♥ Đã yêu thích" : "♡ Thêm yêu thích";
  }
  if (trigger instanceof HTMLElement && trigger.dataset.action === "favorite") {
    const replacement = elements.grid.querySelector(`[data-action="favorite"][data-movie-id="${movieId}"]`);
    (replacement ?? elements.resultsCount).focus();
  } else if (trigger instanceof HTMLElement && trigger.isConnected) {
    trigger.focus();
  }
}

function syncSearchInputs(value) {
  state.query = value;
  for (const input of elements.searchInputs) {
    if (input.value !== value) input.value = value;
  }
  elements.clearSearch.closest(".header-search").classList.toggle("has-value", Boolean(value));
}

function handleSearchInput(event) {
  const value = event.target.value;
  syncSearchInputs(value);
  setSearchSuggestions(value);
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    state.page = 1;
    renderCatalog();
  }, 180);
}

function resetFilters() {
  state.query = "";
  state.genre = "";
  state.year = "";
  state.critics = "";
  state.audience = "";
  state.era = "";
  state.favoritesOnly = false;
  state.sort = "featured";
  state.page = 1;
  syncSearchInputs("");
  for (const filter of elements.filters) {
    if (filter.type === "checkbox") filter.checked = false;
    else filter.value = "";
  }
  elements.sort.value = "featured";
  renderCatalog();
}

function handleAction(actionElement) {
  const action = actionElement.dataset.action;
  const movieId = actionElement.dataset.movieId;

  switch (action) {
    case "flip": {
      const card = actionElement.closest("[data-movie-card]");
      const isFlipped = card.classList.toggle("is-flipped");
      const front = card.querySelector(".movie-card-front");
      const back = card.querySelector(".movie-card-back");
      front.inert = isFlipped;
      front.setAttribute("aria-hidden", String(isFlipped));
      back.inert = !isFlipped;
      back.setAttribute("aria-hidden", String(!isFlipped));
      card.querySelectorAll('[data-action="flip"]').forEach((button) => button.setAttribute("aria-pressed", String(isFlipped)));
      card.querySelector(isFlipped ? '.movie-card-back [data-action="flip"]' : '.movie-card-front [data-action="flip"]').focus();
      break;
    }
    case "favorite":
    case "dialog-favorite":
      toggleFavorite(movieId, actionElement);
      break;
    case "details":
      openMovieDetails(movieId, actionElement);
      break;
    case "play-trailer":
      openTrailer(movieId, actionElement);
      break;
    case "back-to-details":
      openMovieDetails(movieId, actionElement);
      break;
    case "combined-info":
      showToast("Điểm khán giả tổng hợp là trung bình cộng 50/50 giữa điểm khán giả bên ngoài và điểm trung bình cộng đồng website. Đây là chỉ số riêng của Khung Hình, không phải điểm chính thức của Rotten Tomatoes.");
      break;
    case "reveal-spoiler":
      if (state.revealedSpoilers.has(actionElement.dataset.commentId)) {
        state.revealedSpoilers.delete(actionElement.dataset.commentId);
      } else {
        state.revealedSpoilers.add(actionElement.dataset.commentId);
      }
      renderOpenDetails(state.activeDialogMovieId, `[data-action="reveal-spoiler"][data-comment-id="${actionElement.dataset.commentId}"]`);
      break;
    case "edit-comment":
      state.editingCommentId = actionElement.dataset.commentId;
      renderOpenDetails(state.activeDialogMovieId, "[data-comment-form] textarea");
      break;
    case "cancel-edit":
      state.editingCommentId = null;
      renderOpenDetails(state.activeDialogMovieId, "[data-comment-form] textarea");
      break;
    case "delete-comment":
    case "like-comment":
    case "report-comment":
      if (!communityStore) {
        showToast("Không thể dùng bộ nhớ bình luận trên trình duyệt này.", true);
        break;
      }
      try {
        if (action === "delete-comment") {
          communityStore.deleteComment(actionElement.dataset.commentId);
          if (state.editingCommentId === actionElement.dataset.commentId) state.editingCommentId = null;
          showToast("Đã xóa bình luận khỏi trình duyệt này.");
        } else if (action === "like-comment") {
          communityStore.toggleLike(actionElement.dataset.commentId);
        } else {
          communityStore.reportComment(actionElement.dataset.commentId);
          showToast("Đã ghi nhận báo cáo cục bộ. Báo cáo này không được gửi tới hệ thống kiểm duyệt.");
        }
        const focusSelector = action === "delete-comment"
          ? "[data-comment-form] textarea"
          : `[data-action="${action}"][data-comment-id="${actionElement.dataset.commentId}"]`;
        renderOpenDetails(state.activeDialogMovieId, focusSelector);
      } catch (error) {
        handleCommunityError(error, "Could not update a local comment.");
      }
      break;
    case "comment-page":
      state.commentPage = Number(actionElement.dataset.page);
      renderOpenDetails(state.activeDialogMovieId, ".comment-pagination button:not(:disabled)");
      break;
    case "close-dialog":
      elements.dialog.close();
      break;
    case "hero-details":
      openMovieDetails(heroMovies[state.activeHero]?.id, actionElement);
      break;
    case "hero-favorite":
      toggleFavorite(heroMovies[state.activeHero]?.id, actionElement);
      break;
    case "hero-previous":
      moveHero(-1);
      break;
    case "hero-next":
      moveHero(1);
      break;
    case "hero-slide":
      state.activeHero = Number(actionElement.dataset.slide);
      renderHero();
      updateHeroTimer();
      break;
    case "hero-pause":
      setHeroPaused(!state.heroManuallyPaused);
      break;
    case "clear-search":
      syncSearchInputs("");
      setSearchSuggestions("");
      state.page = 1;
      renderCatalog();
      elements.searchInputs[0].focus();
      break;
    case "reset-filters":
      resetFilters();
      break;
    case "favorites":
      state.favoritesOnly = !state.favoritesOnly;
      elements.favoriteFilter.checked = state.favoritesOnly;
      state.page = 1;
      renderCatalog();
      elements.catalog.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
      elements.nav.classList.remove("is-open");
      elements.menuToggle.setAttribute("aria-expanded", "false");
      break;
    case "collection": {
      const collection = actionElement.dataset.collection;
      resetFilters();
      if (collection === "critics" || collection === "audience") {
        state.sort = collection;
        elements.sort.value = collection;
      } else {
        state.era = collection;
        document.querySelector('[data-filter="era"]').value = collection;
      }
      renderCatalog();
      elements.catalog.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
      break;
    }
    case "related-genre":
      resetFilters();
      state.genre = actionElement.dataset.genre;
      document.querySelector('[data-filter="genre"]').value = state.genre;
      renderCatalog();
      elements.dialog.close();
      elements.catalog.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
      break;
    case "previous-page":
      state.page = Math.max(1, state.page - 1);
      renderCatalog();
      break;
    case "next-page":
      state.page += 1;
      renderCatalog();
      break;
    case "page":
      state.page = Number(actionElement.dataset.page);
      renderCatalog();
      break;
    case "menu": {
      const isOpen = elements.nav.classList.toggle("is-open");
      elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
      elements.menuToggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
      break;
    }
    default:
      break;
  }
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const actionElement = event.target.closest("[data-action]");
  if (actionElement) handleAction(actionElement);
});

for (const input of elements.searchInputs) {
  input.addEventListener("input", handleSearchInput);
}

for (const filter of elements.filters) {
  filter.addEventListener("change", () => {
    if (filter.type === "checkbox") state.favoritesOnly = filter.checked;
    else state[filter.dataset.filter] = filter.value;
    state.page = 1;
    renderCatalog();
  });
}

elements.sort.addEventListener("change", () => {
  state.sort = elements.sort.value;
  state.page = 1;
  renderCatalog();
});

elements.pageSize.addEventListener("change", () => {
  state.pageSize = elements.pageSize.value === "all" ? "all" : Number(elements.pageSize.value);
  state.page = 1;
  renderCatalog();
});

elements.hero.addEventListener("mouseenter", () => {
  state.heroHovered = true;
  updateHeroTimer();
});
elements.hero.addEventListener("mouseleave", () => {
  state.heroHovered = false;
  updateHeroTimer();
});
elements.hero.addEventListener("focusin", () => {
  state.heroFocused = true;
  updateHeroTimer();
});
elements.hero.addEventListener("focusout", (event) => {
  if (!elements.hero.contains(event.relatedTarget)) {
    state.heroFocused = false;
    updateHeroTimer();
  }
});

elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});
elements.dialogContent.addEventListener("submit", handleDialogSubmit);
elements.dialogContent.addEventListener("input", (event) => {
  if (event.target instanceof HTMLTextAreaElement && event.target.matches('[name="comment"]')) {
    const counter = event.target.form.querySelector("[data-comment-counter]");
    if (counter) counter.textContent = `${event.target.value.length}/1000`;
    return;
  }
  if (!(event.target instanceof HTMLInputElement) || !event.target.matches('[data-action="comment-search"]')) return;
  const cursorPosition = event.target.selectionStart;
  state.commentQuery = event.target.value;
  state.commentPage = 1;
  renderOpenDetails(state.activeDialogMovieId, "#comment-search");
  const search = elements.dialogContent.querySelector("#comment-search");
  search?.setSelectionRange(cursorPosition, cursorPosition);
});
elements.dialogContent.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLSelectElement) || !event.target.matches('[data-action="comment-sort"]')) return;
  state.commentSort = event.target.value;
  state.commentPage = 1;
  renderOpenDetails(state.activeDialogMovieId, '[data-action="comment-sort"]');
});
elements.dialogContent.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLSelectElement)) return;
  if (event.target.matches('[data-action="comment-filter"]')) {
    state.commentFilter = event.target.value;
    state.commentPage = 1;
  } else if (event.target.matches('[data-action="comment-page-size"]')) {
    state.commentPageSize = event.target.value === "all" ? "all" : Number(event.target.value);
    state.commentPage = 1;
  } else {
    return;
  }
  renderOpenDetails(state.activeDialogMovieId, `[data-action="${event.target.dataset.action}"]`);
});
elements.dialogContent.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLInputElement) || event.target.name !== "user-rating") return;
  const selection = event.target.form.querySelector("[data-rating-selection]");
  if (selection) selection.textContent = `Điểm đã chọn: ${event.target.value}/10`;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.dialog.open) {
    event.preventDefault();
    elements.dialog.close();
  }
});

elements.dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  elements.dialogContent.replaceChildren();
  const fallbackFocus = state.activeDialogMovieId
    ? elements.grid.querySelector(`[data-movie-id="${state.activeDialogMovieId}"] [data-action="flip"]`)
    : null;
  state.activeDialogMovieId = null;
  state.editingCommentId = null;
  state.revealedSpoilers.clear();
  const returnTarget = lastFocusedElement?.isConnected ? lastFocusedElement : fallbackFocus ?? elements.resultsCount;
  returnTarget.focus();
  lastFocusedElement = null;
});

document.addEventListener("error", (event) => {
  if (!(event.target instanceof HTMLImageElement)) return;
  const image = event.target;
  const container = image.closest(".poster-shell, .dialog-poster-shell");
  if (container) {
    container.classList.add("is-image-missing");
    const fallback = container.querySelector(".media-fallback");
    if (fallback) fallback.textContent = image.alt.replace(/^Poster phim /, "") || "Poster không khả dụng";
  } else if (image === elements.heroBackdrop || image.classList.contains("dialog-backdrop")) {
    image.hidden = true;
  }
}, true);

window.addEventListener("storage", (event) => {
  if (event.key === "khung-hinh:favorites") {
    const updated = readFavorites();
    favorites.clear();
    updated.forEach((id) => favorites.add(id));
    renderCatalog();
    renderHero();
    if (elements.dialog.open && state.activeDialogMovieId) {
      openMovieDetails(state.activeDialogMovieId, document.activeElement);
    }
  } else if (event.key === "khung-hinh:community:v1") {
    try {
      communityStore = new CommunityStore();
      renderCatalog();
      if (elements.dialog.open && state.activeDialogMovieId) {
        openMovieDetails(state.activeDialogMovieId, document.activeElement);
      }
    } catch (error) {
      communityStore = null;
      console.error("Could not synchronize community data from another tab.", error);
      showToast("Không thể đồng bộ dữ liệu cộng đồng từ tab khác.", true);
    }
  }
});

reducedMotion.addEventListener("change", (event) => {
  updateHeroTimer();
});

document.querySelector("[data-current-year]").textContent = String(new Date().getFullYear());
populateFilters();
renderHero();
renderCatalog();
updateHeroTimer();
setSearchSuggestions("");

if (!state.storageAvailable) {
  showToast("Không thể đọc danh sách yêu thích đã lưu; danh sách tạm thời rỗng.", true);
}
