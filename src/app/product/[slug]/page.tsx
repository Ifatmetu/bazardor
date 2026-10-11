import Link from "next/link";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProductBySlug } from "@/lib/products";

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

// পূর্ণ সংখ্যা হলে দশমিক ছাড়া, নইলে ২ ঘর
const bnAuto = (n: number) => bn(n, Number.isInteger(n) ? 0 : 2);

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Session check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/signin?next=${encodeURIComponent(`/product/${slug}`)}`);
  }

  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const unit = UNIT_BN[product.unit] ?? product.unit;
  const today = Number(product.today);
  const yesterday = Number(product.yesterday);
  const diff = Math.abs(today - yesterday);

  const dir =
    product.change?.dir ??
    (today > yesterday ? "up" : today < yesterday ? "down" : "flat");

  const pct =
    product.change?.pct ??
    (yesterday !== 0 ? ((today - yesterday) / yesterday) * 100 : 0);

  const isUp = dir === "up";
  const isDown = dir === "down";

  const markets = product.markets ?? [];

  const lowest = markets.length
    ? markets.reduce((a, b) => (b.min < a.min ? b : a))
    : null;

  const highest = markets.length
    ? markets.reduce((a, b) => (b.max > a.max ? b : a))
    : null;

  const validImage =
    typeof product.image === "string" &&
    /^https?:\/\/\S+$/i.test(product.image);

  const trendText = isUp
    ? `গতকালের তুলনায় আজকে দাম বেড়েছে · ${bn(diff)} টাকা`
    : isDown
      ? `গতকালের তুলনায় আজকে দাম কমেছে · ${bn(diff)} টাকা`
      : "গতকালের মতোই দাম অপরিবর্তিত";

  const trendColor = isUp
    ? "text-red-600"
    : isDown
      ? "text-green-600"
      : "text-slate-500";

  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 px-3 py-4 sm:space-y-5 sm:px-5 sm:py-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
        <Link href="/" className="shrink-0 hover:text-gray-900">
          হোম
        </Link>

        <span>›</span>

        <Link
          href={`/category/${product.category}`}
          className="shrink-0 hover:text-gray-900"
        >
          {product.categoryNameBn}
        </Link>

        <span>›</span>

        <span className="break-words font-medium text-gray-800">
          {product.nameBn}
        </span>
      </nav>

      {/* Product hero */}
      <section className="grid min-w-0 grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:gap-5 sm:rounded-2xl sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6">
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 sm:size-16">
            {validImage ? (
              <img
                src={product.image}
                alt={product.nameBn}
                className="size-full object-contain"
              />
            ) : (
              <span className="text-2xl sm:text-3xl">
                {product.image || product.categoryIcon || "🛒"}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="break-words text-xl font-extrabold leading-snug text-gray-900 sm:text-2xl lg:text-3xl">
              {product.nameBn}
            </h1>

            <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
              প্রতি {unit} · {product.categoryNameBn}
            </p>

            <p
              className={`mt-2 break-words text-xs font-semibold leading-relaxed sm:text-sm ${trendColor}`}
            >
              {trendText}
            </p>
          </div>
        </div>

        {/* Today's price */}
        <div className="rounded-xl bg-gray-50 px-4 py-3 text-center sm:px-6 sm:py-4 md:min-w-44">
          <p className="text-xs text-gray-500 sm:text-sm">আজকের দাম</p>

          <p className="mt-1 break-words text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {bn(today)}
          </p>

          <p className="text-xs text-gray-500 sm:text-sm">
            টাকা / {unit}
          </p>

          <p className={`mt-2 text-xs font-bold sm:text-sm ${trendColor}`}>
            {isUp ? "▲" : isDown ? "▼" : "—"} {bn(Math.abs(pct), 1)}%
          </p>
        </div>
      </section>

      {/* Price summary */}
      <section className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
        <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
          দামের সারসংক্ষেপ
        </h2>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3">
          <div className="min-w-0 rounded-xl border border-gray-200 p-3 sm:p-4">
            <p className="text-xs text-gray-500 sm:text-sm">সর্বনিম্ন দাম</p>

            <p className="mt-1 break-words text-xl font-extrabold text-green-600 sm:text-2xl">
              {lowest ? bn(lowest.min) : "—"}{" "}
              <span className="text-sm font-medium">টাকা</span>
            </p>

            <p className="mt-1 break-words text-xs leading-relaxed text-gray-500 sm:text-sm">
              {lowest ? `${lowest.market}-এ সবচেয়ে কম দাম` : "তথ্য নেই"}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-gray-200 p-3 sm:p-4">
            <p className="text-xs text-gray-500 sm:text-sm">সর্বোচ্চ দাম</p>

            <p className="mt-1 break-words text-xl font-extrabold text-red-600 sm:text-2xl">
              {highest ? bn(highest.max) : "—"}{" "}
              <span className="text-sm font-medium">টাকা</span>
            </p>

            <p className="mt-1 break-words text-xs leading-relaxed text-gray-500 sm:text-sm">
              {highest ? `${highest.market}-এ সবচেয়ে বেশি দাম` : "তথ্য নেই"}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-gray-200 p-3 sm:p-4 min-[420px]:col-span-2 md:col-span-1">
            <p className="text-xs text-gray-500 sm:text-sm">গড় দাম</p>

            <p className="mt-1 break-words text-xl font-extrabold text-gray-900 sm:text-2xl">
              {bn(today)}{" "}
              <span className="text-sm font-medium">টাকা</span>
            </p>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              প্রতি {unit}-এর হিসাব
            </p>
          </div>
        </div>
      </section>

      {/* Market-wise prices */}
      <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
        <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <p className="text-sm leading-relaxed text-gray-500">
            এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="-mx-1 overflow-x-auto overscroll-x-contain sm:mx-0">
            <table className="w-full min-w-[540px] text-xs sm:min-w-[600px] sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="whitespace-nowrap px-2 py-3 font-medium sm:px-3">
                    বাজার
                  </th>

                  <th className="whitespace-nowrap px-2 py-3 font-medium sm:px-3">
                    বিভাগ
                  </th>

                  <th className="whitespace-nowrap px-2 py-3 text-right font-medium sm:px-3">
                    সর্বনিম্ন
                  </th>

                  <th className="whitespace-nowrap px-2 py-3 text-right font-medium sm:px-3">
                    সর্বোচ্চ
                  </th>

                  <th className="whitespace-nowrap px-2 py-3 text-right font-medium sm:px-3">
                    গড়
                  </th>
                </tr>
              </thead>

              <tbody>
                {markets.map((m, i) => {
                  const avg = (m.min + m.max) / 2;

                  return (
                    <tr
                      key={`${m.market}-${i}`}
                      className={`border-b border-gray-100 ${
                        i % 2 === 1 ? "bg-gray-50/70" : ""
                      }`}
                    >
                      <td className="whitespace-nowrap px-2 py-3 font-medium text-gray-900 sm:px-3">
                        {m.market}
                      </td>

                      <td className="whitespace-nowrap px-2 py-3 text-gray-600 sm:px-3">
                        {m.division}
                      </td>

                      <td className="whitespace-nowrap px-2 py-3 text-right text-gray-700 sm:px-3">
                        {bn(m.min)} টাকা
                      </td>

                      <td className="whitespace-nowrap px-2 py-3 text-right text-gray-700 sm:px-3">
                        {bn(m.max)} টাকা
                      </td>

                      <td className="whitespace-nowrap px-2 py-3 text-right font-bold text-gray-900 sm:px-3">
                        {bnAuto(avg)} টাকা
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}