"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ProductForm from "@/components/ProductForm";
import { fetchCategories, fetchProductById, updateProductRequest } from "@/lib/api/products";
import { useLocalOverrides } from "@/hooks/useLocalOverrides";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getLocalProduct, editLocalProduct } = useLocalOverrides();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  function load() {
    setStatus("loading");
    const local = getLocalProduct(id);

    if (local.deleted) {
      setStatus("notfound");
      return;
    }
    if (local.product) {
      setProduct(local.product);
      setStatus("success");
      return;
    }

    fetchProductById(id)
      .then((res) => {
        setProduct(local.edit ? { ...res.data, ...local.edit } : res.data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.status === 404) {
          setStatus("notfound");
        } else {
          setStatus("error");
          setErrorMessage(err.normalizedMessage || "Could not load this product.");
        }
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(data) {
    await updateProductRequest(id, data);
    editLocalProduct(Number(id) || id, data);
    router.push(`/products/${id}`);
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 text-lg font-semibold text-ink">Edit product</h1>

        {status === "loading" && <Loader label="Loading product..." />}
        {status === "error" && <ErrorState message={errorMessage} onRetry={load} />}

        {status === "notfound" && (
          <div className="rounded-lg border border-dashed border-line bg-white py-16 text-center">
            <p className="font-medium text-ink">Product not found</p>
            <Link
              href="/products"
              className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentDark"
            >
              Back to products
            </Link>
          </div>
        )}

        {status === "success" && product && (
          <div className="rounded-lg border border-line bg-white p-5">
            <ProductForm
              initial={{
                title: product.title || "",
                category: product.category || "",
                price: product.price ?? "",
                stock: product.stock ?? "",
                rating: product.rating ?? "",
                description: product.description || "",
                thumbnail: product.thumbnail || "",
              }}
              categories={categories}
              submitLabel="Save changes"
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
