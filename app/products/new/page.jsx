"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { fetchCategories, addProductRequest } from "@/lib/api/products";
import { useLocalOverrides } from "@/hooks/useLocalOverrides";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const { addLocalProduct } = useLocalOverrides();

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(data) {
    // We still call the real "add" endpoint so there's a genuine network
    // request, but DummyJSON doesn't persist it - see hooks/useLocalOverrides
    // for why we then save it locally too.
    await addProductRequest(data);
    addLocalProduct(data);
    router.push("/products");
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 text-lg font-semibold text-ink">Add product</h1>
        <div className="rounded-lg border border-line bg-white p-5">
          <ProductForm categories={categories} submitLabel="Add product" onSubmit={handleSubmit} />
        </div>
      </main>
    </ProtectedRoute>
  );
}
