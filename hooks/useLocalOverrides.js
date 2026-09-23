"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "product_overrides_v1";

const EMPTY = { added: [], edited: {}, deletedIds: [] };

function readStore() {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeStore(store) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/**
 * DummyJSON's add/edit/delete endpoints respond with a "success" payload but
 * never actually change the underlying data - the next GET still returns the
 * original list. To make the dashboard behave like a real admin tool, we
 * still call the real endpoints (so the network tab shows a genuine
 * request/response), but we also keep a small "overrides" record in
 * localStorage and merge it into whatever the API returns. That way an
 * add/edit/delete is visible immediately and survives a page refresh,
 * without needing a backend of our own.
 */
export function useLocalOverrides() {
  const [store, setStore] = useState(EMPTY);

  useEffect(() => {
    setStore(readStore());
  }, []);

  const persist = useCallback((next) => {
    setStore(next);
    writeStore(next);
  }, []);

  const addLocalProduct = useCallback(
    (product) => {
      const localProduct = {
        ...product,
        id: Date.now(), // Avoids clashing with real DummyJSON ids (1-194)
        isLocal: true,
      };
      const current = readStore();
      persist({ ...current, added: [localProduct, ...current.added] });
      return localProduct;
    },
    [persist]
  );

  const editLocalProduct = useCallback(
    (id, data) => {
      const current = readStore();
      // If it's a product we added locally, edit it in place there.
      const addedIndex = current.added.findIndex((p) => p.id === id);
      if (addedIndex !== -1) {
        const nextAdded = [...current.added];
        nextAdded[addedIndex] = { ...nextAdded[addedIndex], ...data };
        persist({ ...current, added: nextAdded });
        return;
      }
      // Otherwise it's a real API product - remember the edit separately.
      persist({
        ...current,
        edited: { ...current.edited, [id]: { ...current.edited[id], ...data } },
      });
    },
    [persist]
  );

  const deleteLocalProduct = useCallback(
    (id) => {
      const current = readStore();
      const addedIndex = current.added.findIndex((p) => p.id === id);
      if (addedIndex !== -1) {
        persist({
          ...current,
          added: current.added.filter((p) => p.id !== id),
        });
        return;
      }
      if (current.deletedIds.includes(id)) return;
      persist({ ...current, deletedIds: [...current.deletedIds, id] });
    },
    [persist]
  );

  // Merge overrides into a page of products fetched from the API.
  const applyOverrides = useCallback(
    (products, { page, hasSearchOrFilter }) => {
      const current = readStore();
      let list = products
        .filter((p) => !current.deletedIds.includes(p.id))
        .map((p) => (current.edited[p.id] ? { ...p, ...current.edited[p.id] } : p));

      // Only surface locally-added products on the very first, unfiltered
      // page so they don't seem to duplicate or vanish while paging/searching.
      if (page === 1 && !hasSearchOrFilter && current.added.length > 0) {
        list = [...current.added, ...list];
      }
      return list;
    },
    []
  );

  // Look up a single product from the overrides only (used by the detail/edit
  // pages before falling back to a real API call).
  const getLocalProduct = useCallback((id) => {
    const current = readStore();
    if (current.deletedIds.includes(Number(id))) return { deleted: true };
    const added = current.added.find((p) => String(p.id) === String(id));
    if (added) return { product: added };
    const edit = current.edited[id];
    if (edit) return { edit };
    return {};
  }, []);

  return {
    store,
    addLocalProduct,
    editLocalProduct,
    deleteLocalProduct,
    applyOverrides,
    getLocalProduct,
  };
}
