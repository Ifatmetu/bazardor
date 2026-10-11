
import Link from "next/link";
import { getProducts } from "@/lib/products";

const bn = (n: number, digits = 0) =>
  n.toLocaleString("bn-BD", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export default async function AllProducts() {
  const products = await getProducts();

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-6 lg:px-6">
      {/* Heading */}
      <div className="mb-4 sm:mb-5">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          সব পণ্য
        </h2>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          মোট {bn(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>
      </div>

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const today = Number(product.today);
            const yesterday = Number(product.yesterday);

            const change =
              yesterday !== 0
                ? ((today - yesterday) / yesterday) * 100
                : 0;

            const isUp = change > 0;
            const isDown = change < 0;

            const validImage =
              typeof product.image === "string" &&
              /^https?:\/\/\S+$/i.test(product.image);

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="block min-w-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              >
                <article className="h-full min-w-0 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4">
                  {/* Product image and name */}
                  <div className="flex min-w-0 items-center gap-3">
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
                      <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                        {product.nameBn}
                      </h3>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        প্রতি {product.unit}
                      </p>
                    </div>
                  </div>

                  {/* Price and percentage change */}
                  <div className="mt-3 flex min-w-0 items-end justify-between gap-2 sm:mt-4">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        আজকের দাম
                      </p>

                      <p className="mt-0.5 text-base font-extrabold text-gray-900 sm:text-lg">
                        {bn(today)}{" "}
                        <span className="text-xs font-medium sm:text-sm">
                          টাকা
                        </span>
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold sm:px-2.5 sm:text-xs ${
                        isUp
                          ? "bg-red-50 text-red-600"
                          : isDown
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-slate-500"
                      }`}
                    >
                      {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                      {bn(Math.abs(change), 1)}%
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center">
          <p className="text-3xl">🛒</p>
          <p className="mt-3 text-sm font-semibold text-gray-700">
            কোনো পণ্য পাওয়া যায়নি
          </p>
        </div>
      )}
    </section>
  );
}