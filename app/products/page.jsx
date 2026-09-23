"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import ConfirmModal from "@/components/ConfirmModal";
import ProductList from "@/components/ProductList";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import FilterSortBar from "@/components/FilterSortBar";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalOverrides } from "@/hooks/useLocalOverrides";
import {
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
  deleteProductRequest,
} from "@/lib/api/products";
import { parseLimit, parseOrder, parsePage } from "@/lib/utils";

function ProductsPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ----- URL is the single source of truth for page/search/filter/sort -----
  const page = parsePage(searchParams.get("page"));
  const limit = parseLimit(searchParams.get("limit"));
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = parseOrder(searchParams.get("order"));

  // Local input state for the search box, so typing feels instant while the
  // debounced value (below) is what actually drives the URL/API call.
  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 450);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  // Bumped by the Retry button to force the fetch effect to run again
  // without needing any of the URL params to actually change.
  const [reloadToken, setReloadToken] = useState(0);

  const { applyOverrides, deleteLocalProduct } = useLocalOverrides();

  // Guards against an old, slow response overwriting a newer one.
  const requestIdRef = useRef(0);
  const abortRef = useRef(null);

  function updateUrl(next) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  // Push the debounced search text into the URL, resetting to page 1.
  useEffect(() => {
    if (debouncedSearch === q) return;
    updateUrl({ q: debouncedSearch || undefined, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Load categories once.
  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const hasSearch = q.trim().length > 0;

  // Fetch the current page of products whenever any URL-driven value changes.
  useEffect(() => {
    const requestId = ++requestIdRef.current;

    // Cancel whatever request is still in flight before starting a new one.
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setErrorMessage("");

    const skip = (page - 1) * limit;

    // The DummyJSON API can't search and filter by category in one call, so
    // when there's a search term we ignore the category filter entirely
    // (the category dropdown is also disabled in the UI for the same reason).
    const request = hasSearch
      ? searchProducts({ q, limit, skip, signal: controller.signal })
      : category
      ? fetchProductsByCategory({
          category,
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        })
      : fetchProducts({ limit, skip, sortBy, order, signal: controller.signal });

    request
      .then((res) => {
        // A newer request has already started - throw this response away.
        if (requestId !== requestIdRef.current) return;

        const data = res.data;
        const merged = applyOverrides(data.products, {
          page,
          hasSearchOrFilter: hasSearch || Boolean(category),
        });
        setProducts(merged);
        setTotal(data.total);
        setStatus("success");

        // If the requested page is beyond what actually exists (e.g. someone
        // typed ?page=999 or the result set just got smaller), snap back to
        // the last valid page instead of showing a broken/empty page forever.
        const totalPages = Math.max(1, Math.ceil(data.total / limit));
        if (page > totalPages) {
          updateUrl({ page: totalPages });
        }
      })
      .catch((err) => {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        if (requestId !== requestIdRef.current) return;
        setStatus("error");
        setErrorMessage(err.normalizedMessage || "Could not load products.");
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, q, category, sortBy, order, reloadToken]);

  const retry = useCallback(() => {
    setReloadToken((t) => t + 1);
  }, []);

  function handleDeleteConfirmed() {
    if (!pendingDeleteId) return;
    setDeleting(true);
    deleteProductRequest(pendingDeleteId)
      .catch(() => {
        // DummyJSON's delete is faked and can still "succeed" or fail; either
        // way we remove it locally below since that's the source of truth
        // for what the admin has deleted in this app.
      })
      .finally(() => {
        deleteLocalProduct(pendingDeleteId);
        setProducts((prev) => prev.filter((p) => p.id !== pendingDeleteId));
        setTotal((t) => Math.max(0, t - 1));
        setDeleting(false);
        setPendingDeleteId(null);
      });
  }

  const showEmpty = status === "success" && products.length === 0;

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold text-ink">Products</h1>
          <Link
            href="/products/new"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentDark"
          >
            Add product
          </Link>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={searchInput} onChange={setSearchInput} />
          <FilterSortBar
            categories={categories}
            category={category}
            categoryDisabled={hasSearch}
            onCategoryChange={(value) => updateUrl({ category: value, page: 1 })}
            sortBy={sortBy}
            order={order}
            onSortChange={(nextSort, nextOrder) =>
              updateUrl({ sortBy: nextSort || undefined, order: nextSort ? nextOrder : undefined, page: 1 })
            }
          />
        </div>

        {hasSearch && category === "" && (
          <p className="mb-3 text-xs text-ink/50">
            Category filtering is turned off while searching, since the API only supports one at a time.
          </p>
        )}

        <div className="rounded-lg border border-line bg-white p-4">
          {status === "loading" && <Loader label="Loading products..." />}

          {status === "error" && <ErrorState message={errorMessage} onRetry={retry} />}

          {showEmpty && (
            <EmptyState
              title="No products found"
              message="Try a different search term, category or page."
            />
          )}

          {status === "success" && products.length > 0 && (
            <>
              <ProductList products={products} onDelete={setPendingDeleteId} />
              <div className="mt-4">
                <Pagination
                  page={page}
                  limit={limit}
                  total={total}
                  onPageChange={(p) => updateUrl({ page: p })}
                  onLimitChange={(l) => updateUrl({ limit: l, page: 1 })}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <ConfirmModal
        open={Boolean(pendingDeleteId)}
        title="Delete this product?"
        message="This can't be undone in the app."
        busy={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDeleteId(null)}
      />
    </ProtectedRoute>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductsPageInner />
    </Suspense>
  );
}
