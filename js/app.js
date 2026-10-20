import { movies } from "./movies.js";

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
  storageAvailable: true
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

function scoreMarkup(movie) {
  return `
    <div class="score-list">
      <div class="score-row">
        <span>🍅 Chuyên gia</span>
        <strong>${escapeHtml(formatScore(movie.ratings?.critics))}</strong>
      </div>
      <div class="score-row">
        <span>🍿 Khán giả</span>
        <strong>${escapeHtml(formatScore(movie.ratings?.audience))}</strong>
      </div>
      <div class="score-source">
        <a href="${escapeHtml(movie.ratingUrl)}" target="_blank" rel="noreferrer">Rotten Tomatoes · ${escapeHtml(movie.ratingCheckedAt)}</a>
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
          <p class="back-summary">${escapeHtml(movie.summary)}</p>
          <div class="genre-list">${genres}</div>
          <div class="back-details">
            <div class="back-detail"><span>Đạo diễn</span><span>${escapeHtml(movie.director)}</span></div>
            <div class="back-detail"><span>Quốc gia</span><span>${escapeHtml(movie.country)}</span></div>
            <div class="back-detail"><span>Diễn viên</span><span>${escapeHtml(movie.cast.slice(0, 2).join(", "))}</span></div>
          </div>
          ${scoreMarkup(movie)}
          <div class="back-actions">
            <button class="button button-primary" type="button" data-action="details" data-movie-id="${escapeHtml(movie.id)}">Xem chi tiết</button>
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

function openMovieDetails(movieId, trigger = document.activeElement) {
  const movie = movieById.get(movieId);
  if (!movie) {
    showToast("Không tìm thấy thông tin phim.", true);
    return;
  }

  if (!elements.dialog.open) {
    lastFocusedElement = trigger instanceof HTMLElement ? trigger : null;
  }
  const related = movies
    .filter((candidate) => candidate.id !== movie.id && candidate.genres.some((genre) => movie.genres.includes(genre)))
    .sort((left, right) => {
      const leftOverlap = left.genres.filter((genre) => movie.genres.includes(genre)).length;
      const rightOverlap = right.genres.filter((genre) => movie.genres.includes(genre)).length;
      return rightOverlap - leftOverlap;
    })
    .slice(0, 1);
  const isFavorite = favorites.has(movie.id);

  elements.dialogContent.innerHTML = `
    <img class="dialog-backdrop" src="${escapeHtml(movie.poster)}" alt="" decoding="async">
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
        <p class="dialog-summary">${escapeHtml(movie.summary)}</p>
        <div class="genre-list">${movie.genres.map((genre) => `<span class="genre-chip">${escapeHtml(genre)}</span>`).join("")}</div>
        <p class="dialog-summary"><strong>Đạo diễn:</strong> ${escapeHtml(movie.director)}<br><strong>Diễn viên:</strong> ${escapeHtml(movie.cast.join(", "))}</p>
        <div class="dialog-ratings">
          <div class="dialog-rating"><span>🍅 Tomatometer · chuyên gia</span><strong>${escapeHtml(formatScore(movie.ratings?.critics))}</strong></div>
          <div class="dialog-rating"><span>🍿 Popcornmeter · khán giả</span><strong>${escapeHtml(formatScore(movie.ratings?.audience))}</strong></div>
        </div>
        <a class="dialog-source" href="${escapeHtml(movie.ratingUrl)}" target="_blank" rel="noreferrer">
          Nguồn đánh giá và poster: ${escapeHtml(movie.imageSource)} · kiểm tra ${escapeHtml(movie.ratingCheckedAt)} ↗
        </a>
        <div class="dialog-actions">
          <button class="button button-primary" type="button" data-action="dialog-favorite" data-movie-id="${escapeHtml(movie.id)}" aria-pressed="${isFavorite}">
            ${isFavorite ? "♥ Đã yêu thích" : "♡ Thêm yêu thích"}
          </button>
        </div>
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
  elements.dialog.querySelector("[data-action='close-dialog']").focus();
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.dialog.open) {
    event.preventDefault();
    elements.dialog.close();
  }
});

elements.dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  if (lastFocusedElement?.isConnected) lastFocusedElement.focus();
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
  if (event.key !== "khung-hinh:favorites") return;
  const updated = readFavorites();
  favorites.clear();
  updated.forEach((id) => favorites.add(id));
  renderCatalog();
  renderHero();
  if (elements.dialog.open) {
    const activeMovieId = elements.dialogContent.querySelector("[data-action='dialog-favorite']")?.dataset.movieId;
    if (activeMovieId) openMovieDetails(activeMovieId, document.activeElement);
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
