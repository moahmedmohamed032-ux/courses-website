// EduPath - course listing app (vanilla JS, no frameworks)
// State lives in two variables; render() rebuilds the grid from them.

const state = {
  query: "",
  category: "All"
};

const grid = document.getElementById("courses-grid");
const emptyState = document.getElementById("empty-state");
const resultsCount = document.getElementById("results-count");
const searchInput = document.getElementById("search-input");
const filtersBox = document.getElementById("category-filters");
const overlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");

function formatPrice(course) {
  return course.price === 0 ? "Free" : course.price + " EGP";
}

// One course matches if its category matches AND the search text appears
// in the title, description, tags, or instructor name.
// "Free" is a special filter chip: it matches any course with price 0.
function matches(course) {
  let inCategory;
  if (state.category === "All") {
    inCategory = true;
  } else if (state.category === "Free") {
    inCategory = course.price === 0;
  } else {
    inCategory = course.category === state.category;
  }
  const q = state.query.trim().toLowerCase();
  if (!q) return inCategory;
  const haystack = [course.title, course.description, course.instructor, ...course.tags]
    .join(" ").toLowerCase();
  return inCategory && haystack.includes(q);
}

function renderCourses() {
  const visible = COURSES.filter(matches);
  grid.innerHTML = visible.map(course => `
    <article class="course-card" data-id="${course.id}" tabindex="0" role="button"
             aria-label="View details for ${course.title}">
      <div class="card-top">
        <span class="badge-category">${course.category}</span>
        <span class="badge-level">${course.level}</span>
      </div>
      <h3>${course.title}</h3>
      <p class="desc">${course.description}</p>
      <div class="card-meta">
        <span>${course.hours}h</span>
        <span>${course.lessons} lessons</span>
        <span>${course.students.toLocaleString()} students</span>
      </div>
      <div class="card-bottom">
        <span class="price ${course.price === 0 ? "free" : ""}">${formatPrice(course)}</span>
        <span class="rating">&#9733; ${course.rating}</span>
      </div>
    </article>
  `).join("");

  emptyState.hidden = visible.length > 0;
  resultsCount.textContent = `${visible.length} of ${COURSES.length} courses`;
}

function renderFilters() {
  filtersBox.innerHTML = CATEGORIES.map(cat => `
    <button class="chip ${cat === state.category ? "active" : ""}" data-category="${cat}">${cat}</button>
  `).join("");
}

// --- Modal ---
function openModal(course) {
  modalBody.innerHTML = `
    <span class="badge-category">${course.category}</span>
    <h3 id="modal-title">${course.title}</h3>
    <p class="instructor">By ${course.instructor} &middot; ${course.level}</p>
    <p class="full-desc">${course.description}</p>
    <div class="detail-rows">
      <div>Duration<strong>${course.hours} hours</strong></div>
      <div>Lessons<strong>${course.lessons}</strong></div>
      <div>Students<strong>${course.students.toLocaleString()}</strong></div>
      <div>Rating<strong>&#9733; ${course.rating} / 5</strong></div>
    </div>
    <div class="tags">${course.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    <div class="modal-bottom">
      <span class="price ${course.price === 0 ? "free" : ""}">${formatPrice(course)}</span>
      <button class="btn btn-primary">${course.price === 0 ? "Start for Free" : "Enroll Now"}</button>
    </div>
  `;
  overlay.hidden = false;
  document.body.style.overflow = "hidden"; // stop background scroll while open
}

function closeModal() {
  overlay.hidden = true;
  document.body.style.overflow = "";
}

// --- Events ---
searchInput.addEventListener("input", e => {
  state.query = e.target.value;
  renderCourses();
});

filtersBox.addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  state.category = chip.dataset.category;
  renderFilters();
  renderCourses();
});

// Event delegation: one listener handles every card, even ones rendered later.
grid.addEventListener("click", e => {
  const card = e.target.closest(".course-card");
  if (!card) return;
  const course = COURSES.find(c => c.id === Number(card.dataset.id));
  if (course) openModal(course);
});

// Keyboard access: Enter on a focused card opens it too.
grid.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const card = e.target.closest(".course-card");
  if (!card) return;
  const course = COURSES.find(c => c.id === Number(card.dataset.id));
  if (course) openModal(course);
});

document.getElementById("modal-close").addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !overlay.hidden) closeModal(); });

// "Show Free Courses" in the CTA section activates the Free filter chip.
document.getElementById("cta-free-btn").addEventListener("click", () => {
  state.category = "Free";
  renderFilters();
  renderCourses();
});

renderFilters();
renderCourses();
