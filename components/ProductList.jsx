import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";
import { formatPrice } from "@/lib/utils";

function ActionButtons({ id, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/products/${id}`}
        className="rounded-md border border-line px-2 py-1 text-xs font-medium text-ink hover:bg-paper"
      >
        View
      </Link>
      <Link
        href={`/products/${id}/edit`}
        className="rounded-md border border-line px-2 py-1 text-xs font-medium text-ink hover:bg-paper"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="rounded-md border border-bad/40 px-2 py-1 text-xs font-medium text-bad hover:bg-bad/5"
      >
        Delete
      </button>
    </div>
  );
}

export default function ProductList({ products, onDelete }) {
  return (
    <>
      {/* Desktop: table */}
      <table className="hidden w-full border-collapse text-left text-sm md:table">
        <thead>
          <tr className="border-b border-line text-ink/60">
            <th className="py-2 pr-3 font-medium">Product</th>
            <th className="py-2 pr-3 font-medium">Category</th>
            <th className="py-2 pr-3 font-medium">Price</th>
            <th className="py-2 pr-3 font-medium">Rating</th>
            <th className="py-2 pr-3 font-medium">Stock</th>
            <th className="py-2 pr-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-line/70 align-middle">
              <td className="py-2 pr-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-paper">
                    {p.thumbnail && (
                      <Image
                        src={p.thumbnail}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className="font-medium text-ink">{p.title}</span>
                </div>
              </td>
              <td className="py-2 pr-3 capitalize text-ink/70">{p.category}</td>
              <td className="py-2 pr-3 text-ink/80">{formatPrice(p.price)}</td>
              <td className="py-2 pr-3">
                <StarRating value={p.rating || 0} />
              </td>
              <td className="py-2 pr-3 text-ink/80">{p.stock}</td>
              <td className="py-2 pr-3">
                <ActionButtons id={p.id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {products.map((p) => (
          <div key={p.id} className="rounded-lg border border-line bg-white p-3">
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-paper">
                {p.thumbnail && (
                  <Image
                    src={p.thumbnail}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{p.title}</p>
                <p className="text-xs capitalize text-ink/60">{p.category}</p>
                <div className="mt-1 flex items-center gap-3 text-sm">
                  <span className="text-ink/80">{formatPrice(p.price)}</span>
                  <StarRating value={p.rating || 0} />
                  <span className="text-ink/60">Stock: {p.stock}</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <ActionButtons id={p.id} onDelete={onDelete} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
