# Notes

## Search vs. category filter

DummyJSON's `/products/search` endpoint doesn't accept a category, and
`/products/category/:slug` doesn't accept a search term — so the two can't be
combined in one request. I chose to let **search win**: as soon as there's a
search term, the category dropdown is disabled and greyed out, with a short
line of text explaining why. This felt more honest than silently ignoring one
of the two filters, or trying to fake a combined result by fetching every
category page client-side and filtering in the browser (which would break
pagination and the "showing X of Y" count, since the real total wouldn't
match what the API reports).

## Add / edit / delete aren't really saved by the API

DummyJSON's `POST /products/add`, `PUT /products/:id` and `DELETE
/products/:id` all respond with a "success" payload but never change what a
later `GET` returns. To make the dashboard behave like a real admin tool
instead of quietly losing every change on refresh, I still call the real
endpoints first (so there's a genuine request/response for each action), and
then record the change in `localStorage` via `hooks/useLocalOverrides.js`:

- **Add** → stored as a new item with a locally-generated id (`Date.now()`),
  shown at the top of page 1.
- **Edit** → the changed fields are stored keyed by product id and merged
  over whatever the API returns for that id.
- **Delete** → the id is added to a "deleted" list and filtered out of every
  list/detail view, so it looks and behaves as if it were really deleted.

This is a deliberate trade-off for a demo API with no real backend. In a real
app this would just be normal server state.

## A problem I ran into: stale search results winning a race

Early on, typing quickly into the search box (or testing with
`&delay=2000` appended to the API URL) could let an older, slower request's
response land *after* a newer one and overwrite it — so the list would
briefly "jump back" to results for a search term that had already been
replaced. I fixed this two ways together in `app/products/page.jsx`:

1. An `AbortController` is created per request, and the previous one is
   aborted whenever a new fetch starts, so in-flight requests are actually
   cancelled at the network level.
2. A `requestIdRef` counter is incremented on every fetch; a response is only
   applied to state if its id still matches the latest one. This is the real
   safety net — even if an abort doesn't fire in time, a stale response is
   simply ignored.

## Where AI tools helped

I used an AI assistant to scaffold the repetitive parts (the Axios
interceptor boilerplate, the Tailwind table/card markup, and the pagination
page-number-with-ellipsis logic) and to sanity-check the URL-sanitizing
helpers in `lib/utils.js` against edge cases like `?page=abc` and
`?page=-1`. I reviewed and adjusted the generated code — in particular the
request-cancellation logic above, and the local-overrides approach for
add/edit/delete — and can walk through and explain every file.
