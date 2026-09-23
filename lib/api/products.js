import api from "@/lib/axiosClient";

/**
 * Plain product list, with pagination and optional sorting.
 * DummyJSON: GET /products?limit=&skip=&sortBy=&order=
 */
export function fetchProducts({ limit, skip, sortBy, order, signal }) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  return api.get("/products", { params, signal });
}

/**
 * Text search. DummyJSON: GET /products/search?q=&limit=&skip=
 * Note: the search endpoint does not support category filtering, so callers
 * should not pass a category alongside q (see app/products/page.jsx).
 */
export function searchProducts({ q, limit, skip, signal }) {
  return api.get("/products/search", { params: { q, limit, skip }, signal });
}

/**
 * Filter by category. DummyJSON: GET /products/category/:category
 */
export function fetchProductsByCategory({
  category,
  limit,
  skip,
  sortBy,
  order,
  signal,
}) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  return api.get(`/products/category/${encodeURIComponent(category)}`, {
    params,
    signal,
  });
}

// GET /products/categories -> array of { slug, name, url }
export function fetchCategories(signal) {
  return api.get("/products/categories", { signal });
}

// GET /products/:id
export function fetchProductById(id, signal) {
  return api.get(`/products/${id}`, { signal });
}

// POST /products/add - DummyJSON fakes this: it responds with a "created"
// product but never actually stores it. See hooks/useLocalOverrides.js for
// how we make the change feel real inside the app anyway.
export function addProductRequest(data) {
  return api.post("/products/add", data);
}

// PUT /products/:id - also faked by DummyJSON (does not persist).
export function updateProductRequest(id, data) {
  return api.put(`/products/${id}`, data);
}

// DELETE /products/:id - also faked by DummyJSON (does not persist).
export function deleteProductRequest(id) {
  return api.delete(`/products/${id}`);
}
