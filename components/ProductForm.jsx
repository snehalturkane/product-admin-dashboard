"use client";

import { useState } from "react";

const EMPTY_FORM = {
  title: "",
  category: "",
  price: "",
  stock: "",
  rating: "",
  description: "",
  thumbnail: "",
};

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required.";
  if (!form.category.trim()) errors.category = "Category is required.";

  const price = Number(form.price);
  if (form.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }

  const stock = Number(form.stock);
  if (form.stock === "" || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.stock = "Enter a whole number of 0 or more.";
  }

  if (form.rating !== "") {
    const rating = Number(form.rating);
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      errors.rating = "Rating must be between 0 and 5.";
    }
  }

  if (!form.description.trim()) errors.description = "Description is required.";

  return errors;
}

export default function ProductForm({ initial, categories, submitLabel, onSubmit }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Guard against double-clicks / double-submits sending the request twice.
    if (submitting) return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        rating: form.rating === "" ? 0 : Number(form.rating),
        description: form.description.trim(),
        thumbnail: form.thumbnail.trim() || undefined,
      });
    } catch (err) {
      setSubmitError(err.normalizedMessage || "Could not save this product.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-ink">
          Title
        </label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-md border border-line px-3 py-2 text-sm"
        />
        {errors.title && <p className="mt-1 text-xs text-bad">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-ink">
          Category
        </label>
        <input
          id="category"
          list="category-options"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="w-full rounded-md border border-line px-3 py-2 text-sm"
        />
        <datalist id="category-options">
          {categories.map((c) => (
            <option key={c.slug} value={c.slug} />
          ))}
        </datalist>
        {errors.category && <p className="mt-1 text-xs text-bad">{errors.category}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-ink">
            Price ($)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
          {errors.price && <p className="mt-1 text-xs text-bad">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor="stock" className="mb-1 block text-sm font-medium text-ink">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
          {errors.stock && <p className="mt-1 text-xs text-bad">{errors.stock}</p>}
        </div>
        <div>
          <label htmlFor="rating" className="mb-1 block text-sm font-medium text-ink">
            Rating (0-5)
          </label>
          <input
            id="rating"
            type="number"
            step="0.01"
            value={form.rating}
            onChange={(e) => update("rating", e.target.value)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
          {errors.rating && <p className="mt-1 text-xs text-bad">{errors.rating}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="thumbnail" className="mb-1 block text-sm font-medium text-ink">
          Image URL (optional)
        </label>
        <input
          id="thumbnail"
          value={form.thumbnail}
          onChange={(e) => update("thumbnail", e.target.value)}
          placeholder="https://..."
          className="w-full rounded-md border border-line px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-md border border-line px-3 py-2 text-sm"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-bad">{errors.description}</p>
        )}
      </div>

      {submitError && <p className="text-sm text-bad">{submitError}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentDark disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
