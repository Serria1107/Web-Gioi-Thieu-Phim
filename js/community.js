const storageKey = "khung-hinh:community:v1";
const maximumCommentLength = 1000;
const commentCooldown = 15000;

function createId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emptyData() {
  return { version: 1, ratings: [], comments: [] };
}

function validateData(data) {
  if (
    !data
    || data.version !== 1
    || !Array.isArray(data.ratings)
    || !Array.isArray(data.comments)
  ) {
    throw new TypeError("Community storage contains an unsupported or invalid data structure.");
  }

  const ratingMovieIds = new Set();
  for (const rating of data.ratings) {
    if (
      typeof rating.movieId !== "string"
      || !Number.isInteger(rating.score)
      || rating.score < 1
      || rating.score > 10
      || typeof rating.createdAt !== "string"
      || typeof rating.updatedAt !== "string"
      || Number.isNaN(Date.parse(rating.createdAt))
      || Number.isNaN(Date.parse(rating.updatedAt))
      || ratingMovieIds.has(rating.movieId)
    ) {
      throw new TypeError("Community storage contains an invalid or duplicate rating.");
    }
    ratingMovieIds.add(rating.movieId);
  }

  const commentIds = new Set();
  for (const comment of data.comments) {
    if (
      typeof comment.id !== "string"
      || typeof comment.movieId !== "string"
      || typeof comment.content !== "string"
      || comment.content.trim().length === 0
      || comment.content.length > maximumCommentLength
      || typeof comment.isSpoiler !== "boolean"
      || typeof comment.createdAt !== "string"
      || typeof comment.updatedAt !== "string"
      || Number.isNaN(Date.parse(comment.createdAt))
      || Number.isNaN(Date.parse(comment.updatedAt))
      || !Number.isInteger(comment.likeCount)
      || comment.likeCount < 0
      || typeof comment.liked !== "boolean"
      || !Number.isInteger(comment.reportCount)
      || comment.reportCount < 0
      || commentIds.has(comment.id)
    ) {
      throw new TypeError("Community storage contains an invalid comment.");
    }
    commentIds.add(comment.id);
  }

  return data;
}

export class CommunityStore {
  constructor(storage = window.localStorage) {
    this.storage = storage;
    const stored = storage.getItem(storageKey);
    this.data = stored ? validateData(JSON.parse(stored)) : emptyData();
  }

  getMovieData(movieId) {
    return {
      rating: this.data.ratings.find((item) => item.movieId === movieId) ?? null,
      comments: this.data.comments.filter((item) => item.movieId === movieId)
    };
  }

  setRating(movieId, score) {
    if (!Number.isInteger(score) || score < 1 || score > 10) {
      throw new RangeError("Choose a whole-number rating from 1 to 10.");
    }

    const existing = this.data.ratings.find((item) => item.movieId === movieId);
    const now = new Date().toISOString();
    const rating = existing
      ? { ...existing, score, updatedAt: now }
      : { movieId, score, createdAt: now, updatedAt: now };
    const ratings = existing
      ? this.data.ratings.map((item) => item.movieId === movieId ? rating : item)
      : [...this.data.ratings, rating];
    this.persist({ ...this.data, ratings });
    return rating;
  }

  addComment(movieId, content, isSpoiler) {
    const normalizedContent = content.trim();
    if (!normalizedContent) throw new TypeError("Comment text cannot be empty.");
    if (normalizedContent.length > maximumCommentLength) {
      throw new RangeError(`Comments cannot exceed ${maximumCommentLength} characters.`);
    }
    if (typeof isSpoiler !== "boolean") throw new TypeError("Spoiler state must be selected.");

    const lastComment = this.data.comments.reduce((latest, comment) => (
      !latest || Date.parse(comment.createdAt) > Date.parse(latest.createdAt)
        ? comment
        : latest
    ), null);
    if (lastComment && Date.now() - Date.parse(lastComment.createdAt) < commentCooldown) {
      throw new Error("Vui lòng đợi một chút trước khi gửi bình luận tiếp theo.");
    }

    const now = new Date().toISOString();
    const comment = {
      id: createId(),
      movieId,
      content: normalizedContent,
      isSpoiler,
      createdAt: now,
      updatedAt: now,
      likeCount: 0,
      liked: false,
      reportCount: 0
    };
    this.persist({ ...this.data, comments: [...this.data.comments, comment] });
    return comment;
  }

  editComment(commentId, content, isSpoiler) {
    const normalizedContent = content.trim();
    if (!normalizedContent) throw new TypeError("Comment text cannot be empty.");
    if (normalizedContent.length > maximumCommentLength) {
      throw new RangeError(`Comments cannot exceed ${maximumCommentLength} characters.`);
    }
    if (typeof isSpoiler !== "boolean") throw new TypeError("Spoiler state must be selected.");
    if (!this.data.comments.some((comment) => comment.id === commentId)) {
      throw new Error("Không tìm thấy bình luận cần chỉnh sửa.");
    }

    const comments = this.data.comments.map((comment) => comment.id === commentId
      ? { ...comment, content: normalizedContent, isSpoiler, updatedAt: new Date().toISOString() }
      : comment);
    this.persist({ ...this.data, comments });
  }

  deleteComment(commentId) {
    if (!this.data.comments.some((comment) => comment.id === commentId)) {
      throw new Error("Không tìm thấy bình luận cần xóa.");
    }
    this.persist({
      ...this.data,
      comments: this.data.comments.filter((comment) => comment.id !== commentId)
    });
  }

  toggleLike(commentId) {
    const comment = this.data.comments.find((item) => item.id === commentId);
    if (!comment) throw new Error("Không tìm thấy bình luận.");

    const comments = this.data.comments.map((item) => item.id === commentId
      ? { ...item, liked: !item.liked, likeCount: Math.max(0, item.likeCount + (item.liked ? -1 : 1)) }
      : item);
    this.persist({ ...this.data, comments });
  }

  reportComment(commentId) {
    if (!this.data.comments.some((comment) => comment.id === commentId)) {
      throw new Error("Không tìm thấy bình luận cần báo cáo.");
    }

    const comments = this.data.comments.map((comment) => comment.id === commentId
      ? { ...comment, reportCount: comment.reportCount + 1 }
      : comment);
    this.persist({ ...this.data, comments });
  }

  persist(data) {
    const validatedData = validateData(data);
    this.storage.setItem(storageKey, JSON.stringify(validatedData));
    this.data = validatedData;
  }
}

export function summarizeRatings(movie, communityRating) {
  const externalAudienceScore = movie.externalAudienceScore;
  const externalScore = Number.isFinite(externalAudienceScore)
    ? externalAudienceScore / 10
    : null;
  const websiteScore = Number.isFinite(communityRating) ? communityRating : null;
  const combinedScore = externalScore !== null && websiteScore !== null
    ? (externalScore + websiteScore) / 2
    : null;

  return { externalScore, websiteScore, combinedScore };
}
