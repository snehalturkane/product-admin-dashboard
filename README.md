# Product Admin Dashboard

A small admin dashboard for managing products, built with Next.js (App Router), React, Tailwind CSS and Axios, backed by the [DummyJSON](https://dummyjson.com) API.

## Live demo

- Live link: _add your Vercel/Netlify URL here_
- Repo: _add your GitHub URL here_

## Setup

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. Log in with:

- Username: `emilys`
- Password: `emilyspass`

No environment variables are needed — the DummyJSON base URL is set in `lib/axiosClient.js`.

### Build for production

```bash
npm run build
npm start
```

## Project structure

```
app/                     Next.js App Router pages
  login/                 Login page
  products/              Product list (protected)
  products/[id]/         Product details (protected)
  products/[id]/edit/    Edit product (protected)
  products/new/          Add product (protected)
components/              Small, focused UI components (no API calls inside them)
context/AuthContext.jsx  Login state, stored in localStorage
hooks/                   useDebounce, useLocalOverrides
lib/axiosClient.js       The one shared Axios instance (token + error handling)
lib/api/                 All API calls, grouped by resource
lib/utils.js             URL param parsing/sanitizing, formatting helpers
```

## What's finished

- [x] Login with DummyJSON `/auth/login`, error message on wrong credentials, logout button
- [x] Route protection — `/products/*` redirects to `/login` if not signed in
- [x] Product list: image, title, category, price, rating, stock
- [x] Responsive layout: table on desktop, stacked cards on mobile
- [x] Pagination via `limit`/`skip`: page numbers, Previous/Next, page size (10/20/50), "Showing X–Y of Z"
- [x] Debounced search against `/products/search`, resets to page 1 on change
- [x] Category filter (`/products/categories`) and sort by price/rating/title (asc/desc)
- [x] Product details page at `/products/[id]`, with images, description, price and reviews
- [x] "Not found" state for a bad/missing id
- [x] Add / edit product with validation, delete with a confirm dialog
- [x] Loading, empty and error (with Retry) states everywhere data is fetched
- [x] One shared Axios instance that attaches the token and handles errors centrally
- [x] Page, search, category and sort are all kept in the URL (shareable/refreshable)
- [x] Stale search responses can never overwrite newer ones (tested with `&delay=2000`)
- [x] Bad URL values (`?page=abc`, `?page=999`) are sanitized instead of breaking the page
- [x] Repeated clicks on Login/Save can't fire duplicate requests

No table/pagination/data-fetching library was used — pagination, search and sorting logic are all written by hand in `app/products/page.jsx`.

## Design/approach notes

See `NOTES.md` for the write-up on trade-offs, the trickiest bug, and where AI tools helped.
