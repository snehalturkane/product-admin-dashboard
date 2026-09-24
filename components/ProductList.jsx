import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";
import { formatPrice } from "@/lib/utils";

function categoryDotColor(category) {
  const palette = ["#C9852B", "#1F7A4D", "#2D6BB0", "#8A4FB5", "#B3261E", "#0F8A8A"];
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = category.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function CategoryChip({ category }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-xs font-medium capitalize text-ink/70">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: categoryDotColor(category || "x") }}
      />
      {category}
    </span>
  );
}

function StockBadge({ stock }) {
  const pct = Math.min(100, Math.round((stock / 100) * 100));
  const tone =
    stock <= 10
      ? { text: "text-bad", bar: "bg-bad", label: "Critical" }
      : stock <= 30
      ? { text: "text-accent", bar: "bg-accent", label: "Low" }
      : { text: "text-good", bar: "bg-good", label: "Healthy" };

  return (
    <div className="w-24">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${tone.text}`}>{stock}</span>
        <span className="text-ink/40">{tone.label}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full ${tone.bar} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Thumbnail({ src, size = "h-14 w-14" }) {
  return (
    <div
      className={`group relative ${size} shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-paper to-line/60 ring-1 ring-line`}
    >
      {src && (
        <Image
          src={src}
          alt=""
          fill
          sizes="80px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
        />
      )}
    </div>
  );
}

function ActionButtons({ id, onDelete }) {
  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={`/products/${id}`}
        className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
      >
        View
      </Link>
      <Link
        href={`/products/${id}/edit`}
        className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="rounded-lg border border-bad/30 px-2.5 py-1.5 text-xs font-medium text-bad transition-colors hover:bg-bad hover:text-white"
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
          <tr className="border-b border-line text-xs uppercase tracking-wide text-ink/40">
            <th className="py-3 pr-3 font-medium">Product</th>
            <th className="py-3 pr-3 font-medium">Category</th>
            <th className="py-3 pr-3 font-medium">Price</th>
            <th className="py-3 pr-3 font-medium">Rating</th>
            <th className="py-3 pr-3 font-medium">Stock</th>
            <th className="py-3 pr-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className="border-b border-line/70 align-middle transition-colors hover:bg-paper/70"
            >
              <td className="py-3 pr-3">
                <div className="flex items-center gap-3">
                  <Thumbnail src={p.thumbnail} />
                  <span className="font-medium text-ink">{p.title}</span>
                </div>
              </td>
              <td className="py-3 pr-3">
                <CategoryChip category={p.category} />
              </td>
              <td className="py-3 pr-3 font-semibold text-ink">{formatPrice(p.price)}</td>
              <td className="py-3 pr-3">
                <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-1">
                  <StarRating value={p.rating || 0} />
                </span>
              </td>
              <td className="py-3 pr-3">
                <StockBadge stock={p.stock} />
              </td>
              <td className="py-3 pr-3">
                <ActionButtons id={p.id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-line bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex gap-3">
              <Thumbnail src={p.thumbnail} size="h-16 w-16" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{p.title}</p>
                <div className="mt-1">
                  <CategoryChip category={p.category} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="font-semibold text-ink">{formatPrice(p.price)}</span>
                  <StarRating value={p.rating || 0} />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <StockBadge stock={p.stock} />
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