import Link from "next/link";
import SortSelect from "@/Components/SortSelect";
import { getProducts } from "@/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

const bn = (n: number, digits = 0) =>
  n.toLocaleString("bn-BD", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const all = await getProducts();
  const items = all.filter((p) => p.category === slug);

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
        <Link
          href="/"
          className="mb-5 inline-block text-sm text-green-700 hover:underline"
        >
          ← হোমে ফিরে যাও
        </Link>

        <p className="text-sm text-gray-500 sm:text-base">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
        </p>
      </main>
    );
  }

  // ডিফল্ট = API এর order, low/high = আজকের দাম অনুযায়ী
  const sortKey =
    sort === "low" || sort === "high" ? sort : "default";

  const sorted = [...items];

  if (sortKey === "low") {
    sorted.sort((a, b) => Number(a.today) - Number(b.today));
  } else if (sortKey === "high") {
    sorted.sort((a, b) => Number(b.today) - Number(a.today));
  }

  const first = items[0];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 px-3 py-4 sm:space-y-5 sm:px-5 sm:py-6 lg:px-8">
      {/* Heading */}
      <section className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:gap-4 sm:rounded-2xl sm:p-5">
        <span className="shrink-0 text-3xl sm:text-4xl">
          {first.categoryIcon}
        </span>

        <div className="min-w-0 flex-1">
          <h1 className="break-words text-lg font-extrabold text-gray-900 sm:text-2xl">
            {first.categoryNameBn}
          </h1>

          <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
            {bn(items.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </section>

      {/* Sort bar */}
      <section className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
        <p className="shrink-0 text-xs text-gray-600 sm:text-sm">
          দাম অনুযায়ী সাজান
        </p>

        <div className="min-w-0 max-w-full">
          <SortSelect value={sortKey} />
        </div>
      </section>

      <p className="text-xs text-gray-500 sm:text-sm">
        মোট {bn(sorted.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      {/* Responsive product cards */}
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((product) => {
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
              className="block min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:rounded-2xl"
            >
              <article className="h-full min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md sm:rounded-2xl sm:p-4">
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:size-14 sm:rounded-xl">
                    {validImage ? (
                      <img
                        src={product.image}
                        alt={product.nameBn}
                        loading="lazy"
                        className="size-full object-contain"
                      />
                    ) : (
                      <span className="text-xl sm:text-2xl">
                        {product.image || product.categoryIcon || "🛒"}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-bold leading-snug text-gray-900 sm:text-base">
                      {product.nameBn}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      প্রতি {UNIT_BN[product.unit] ?? product.unit}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex min-w-0 flex-wrap items-end justify-between gap-2 border-t border-gray-100 pt-3">
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
                    className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold sm:px-2.5 sm:text-xs ${
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
    </main>
  );
}