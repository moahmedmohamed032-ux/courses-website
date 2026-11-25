# EduPath - Courses Website

A clean, responsive course-listing website for an imaginary online learning platform. Visitors can browse course cards, search by keyword, filter by category, and open a detail view (modal) for any course.

## What it does

- Shows 12 sample courses as cards: title, category, level, duration, lesson count, student count, rating, and price (EGP or Free).
- Live search across titles, descriptions, instructors, and tags - results update as you type.
- Category filter chips, including a special "Free" chip that shows only free courses.
- Clicking a card opens a modal with the full course details. Closes with the X button, clicking outside, or the Escape key.
- Fully responsive layout, from mobile to desktop.

## Tech used

- HTML5, CSS3 (custom properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+) - no frameworks, no build tools
- Sample data lives in `js/data.js`, app logic in `js/app.js`

## How to run

Open `index.html` in any browser. No server or installation needed.

## Talking points (what the code demonstrates)

- **State-driven rendering:** the app keeps its state (`query` + `category`) in one object and re-renders the course grid from it on every change - the same core idea behind React, done by hand.
- **Event delegation:** one click listener on the grid handles every course card, including cards rendered after the page loads, using `closest()` to find which card was clicked.
- **Array methods in practice:** filtering with `Array.filter()`, building HTML with `Array.map()` + `join()`, and looking up courses with `Array.find()`.
- **Accessibility basics:** cards are keyboard-focusable and open with Enter, the modal uses `role="dialog"`, and inputs have labels/ARIA attributes.
