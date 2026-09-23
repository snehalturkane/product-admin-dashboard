"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import StarRating from "@/components/StarRating";
import { fetchProductById } from "@/lib/api/products";
import { useLocalOverrides } from "@/hooks/useLocalOverrides";
import { formatPrice } from "@/lib/utils";

function NotFound() {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white py-16 text-center">
      <p className="text-lg font-medium text-ink">Product not found</p>
      <p className="mt-1 text-sm text-ink/60">
        There's no product with this id.
      </p>
      <Link
        href="/products"
        className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentDark"
      >
        Back to products
      </Link>
    </div>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { getLocalProduct } = useLocalOverrides();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error | notfound
  const [errorMessage, setErrorMessage] = useState("");

  function load() {
    setStatus("loading");

    // A locally-deleted product should look "not found" here, even though
    // the real API would still happily return it.
    const local = getLocalProduct(id);
    if (local.deleted) {
      setStatus("notfound");
      return;
    }
    // A product that only exists locally (added in this browser) never made
    // it to the real API, so read it straight from the overrides.
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

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Link href="/products" className="text-sm text-ink/60 hover:text-ink">
          ← Back to products
        </Link>

        <div className="mt-4">
          {status === "loading" && <Loader label="Loading product..." />}
          {status === "error" && <ErrorState message={errorMessage} onRetry={load} />}
          {status === "notfound" && <NotFound />}

          {status === "success" && product && (
            <div className="rounded-lg border border-line bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl font-semibold text-ink">{product.title}</h1>
                <Link
                  href={`/products/${id}/edit`}
                  className="shrink-0 rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:bg-paper"
                >
                  Edit
                </Link>
              </div>
              <p className="mt-1 text-sm capitalize text-ink/60">{product.category}</p>

              {product.images?.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {product.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative h-40 w-40 shrink-0 overflow-hidden rounded-md bg-paper"
                    >
                      <Image src={src} alt="" fill sizes="160px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="text-lg font-semibold text-ink">
                  {formatPrice(product.price)}
                </span>
                <StarRating value={product.rating || 0} />
                <span className="text-ink/70">Stock: {product.stock}</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink/80">
                {product.description}
              </p>

              {product.reviews?.length > 0 && (
                <div className="mt-6 border-t border-line pt-4">
                  <h2 className="text-sm font-semibold text-ink">Reviews</h2>
                  <div className="mt-3 flex flex-col gap-3">
                    {product.reviews.map((r, i) => (
                      <div key={i} className="rounded-md border border-line p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-ink">
                            {r.reviewerName}
                          </span>
                          <StarRating value={r.rating || 0} />
                        </div>
                        <p className="mt-1 text-sm text-ink/70">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
