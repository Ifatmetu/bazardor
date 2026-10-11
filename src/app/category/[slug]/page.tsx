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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const all = await getProducts();
  const items = all.filter((p) => p.category === slug);

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-green-700 hover:underline"
        >
          ← হোমে ফিরে যাও
        </Link>
        <p className="text-gray-500">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
        </p>
      </main>
    );
  }

  // ডিফল্ট = API এর order, low/high = আজকের দাম অনুযায়ী
  const sortKey = sort === "low" || sort === "high" ? sort : "default";

  const sorted = [...items];
  if (sortKey === "low") {
    sorted.sort((a, b) => Number(a.today) - Number(b.today));
  } else if (sortKey === "high") {
    sorted.sort((a, b) => Number(b.today) - Number(a.today));
  }

  const first = items[0];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-6">
      {/* Heading */}
      <section className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <span className="text-4xl">{first.categoryIcon}</span>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {first.categoryNameBn}
          </h1>
          <p className="text-xs text-gray-500">
            {bn(items.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </section>

      {/* Sort bar */}
      <section className="flex justify-end rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <SortSelect value={sortKey} />
      </section>

      <p className="text-xs text-gray-500">
        মোট {bn(sorted.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((product) => {
          const today = Number(product.today);
          const yesterday = Number(product.yesterday);
          const change =
            yesterday !== 0 ? ((today - yesterday) / yesterday) * 100 : 0;
          const isUp = change > 0;
          const isDown = change < 0;

          const validImage =
            typeof product.image === "string" &&
            /^https?:\/\/\S+$/i.test(product.image);

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="block"
            >
              <article className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                    {validImage ? (
                      <img
                        src={product.image}
                        alt={product.nameBn}
                        className="size-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl">
                        {product.image || product.categoryIcon || "🛒"}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-gray-900">
                      {product.nameBn}
                    </h3>
                    <p className="text-xs text-gray-500">
                      প্রতি {UNIT_BN[product.unit] ?? product.unit}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-500">আজকের দাম</p>
                    <p className="text-lg font-extrabold text-gray-900">
                      {bn(today)}{" "}
                      <span className="text-sm font-medium">টাকা</span>
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
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