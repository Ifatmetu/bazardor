import Link from "next/link";
import { getProducts } from "@/lib/products";

const bn = (n: number, digits = 0) =>
  n.toLocaleString("bn-BD", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export default async function PriceRise() {
  const products = await getProducts();

  const risen = products
    .map((p) => {
      const today = Number(p.today);
      const yesterday = Number(p.yesterday);

      const change =
        yesterday !== 0
          ? ((today - yesterday) / yesterday) * 100
          : 0;

      return { ...p, today, yesterday, change };
    })
    .filter((p) => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  if (risen.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-6 lg:px-6">
      {/* Section heading */}
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 sm:mb-5 sm:text-xl">
        <span className="text-sm text-red-600 sm:text-base">
          ▲
        </span>
        আজ দাম বেড়েছে
      </h2>

      {/* Responsive product grid */}
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {risen.map((product) => {
          const validImage =
            typeof product.image === "string" &&
            /^https?:\/\/\S+$/i.test(product.image);

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group block min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
              <article className="h-full rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition duration-200 group-hover:border-red-200 group-hover:shadow-md sm:p-4">
                {/* Product image and name */}
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:size-12">
                    {validImage ? (
                      <img
                        src={product.image}
                        alt={product.nameBn}
                        loading="lazy"
                        className="size-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl">
                        {product.categoryIcon || "🛒"}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-sm font-bold text-gray-900 transition-colors group-hover:text-red-700 sm:text-base">
                      {product.nameBn}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      প্রতি {product.unit}
                    </p>
                  </div>
                </div>

                {/* Price and percentage change */}
                <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-gray-100 pt-3 sm:mt-4 sm:pt-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      আজকের দাম
                    </p>

                    <p className="mt-1 text-base font-extrabold text-gray-900 sm:text-lg">
                      {bn(product.today)}{" "}
                      <span className="text-xs font-medium sm:text-sm">
                        টাকা
                      </span>
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600 sm:px-2.5">
                    <span aria-hidden="true">▲</span>
                    {bn(product.change, 1)}%
                  </span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
