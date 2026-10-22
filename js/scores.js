(() => {
  'use strict';
  window.KH = window.KH || {};
  const mean = values => {
    const valid = values.filter(value => typeof value === 'number' && Number.isFinite(value));
    return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
  };
  function normalize(source) {
    if (!source || source.status !== 'verified' || source.metric !== 'rating'
      || typeof source.value !== 'number' || typeof source.scale !== 'number'
      || !Number.isFinite(source.value) || !Number.isFinite(source.scale)
      || source.scale <= 0 || source.value < 0 || source.value > source.scale) return null;
    return source.value / source.scale * 10;
  }
  function calculate(movie, reviews = []) {
    const sources = Array.isArray(movie?.ratings) ? movie.ratings : [];
    const critics = mean(sources.filter(source => source.group === 'critics').map(normalize));
    const audience = mean(sources.filter(source => source.group === 'audience').map(normalize));
    const external = mean([critics, audience]);
    const validReviews = reviews.filter(review => typeof review.score === 'number'
      && Number.isFinite(review.score) && review.score >= 1 && review.score <= 10);
    const internal = mean(validReviews.map(review => review.score));
    return { critics, audience, external, internal, total: mean([external, internal]), count: validReviews.length };
  }
  const format = value => typeof value === 'number' && Number.isFinite(value) ? value.toFixed(1) : '—';
  function note(scores) {
    if (scores.external == null && scores.internal == null) return 'Chưa có đánh giá.';
    if (scores.internal == null) return 'Chưa có đánh giá nội bộ; điểm tổng hợp hiện dùng điểm bên ngoài.';
    if (scores.external == null) return 'Chưa có điểm bên ngoài; điểm tổng hợp hiện dùng đánh giá nội bộ.';
    return 'Điểm bên ngoài và điểm nội bộ có trọng số bằng nhau.';
  }
  window.KH.scores = { mean, normalize, calculate, format, note };
})();
