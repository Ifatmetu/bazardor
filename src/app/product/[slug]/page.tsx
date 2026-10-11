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

  // middleware cookie check kore, ekhane real session check
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/signin?next=${encodeURIComponent(`/product/${slug}`)}`);
  }

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const unit = UNIT_BN[product.unit] ?? product.unit;
  const today = Number(product.today);
  const yesterday = Number(product.yesterday);
  const diff = Math.abs(today - yesterday);

  // API te change na thakle nijei hisab
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
    <main className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-900">
          হোম
        </Link>
        <span>›</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-gray-900"
        >
          {product.categoryNameBn}
        </Link>
        <span>›</span>
        <span className="font-medium text-gray-800">{product.nameBn}</span>
      </nav>

      {/* Hero */}
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {validImage ? (
              <img
                src={product.image}
                alt={product.nameBn}
                className="size-full object-contain"
              />
            ) : (
              <span className="text-3xl">
                {product.image || product.categoryIcon || "🛒"}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {product.nameBn}
            </h1>
            <p className="text-xs text-gray-500">
              প্রতি {unit} · {product.categoryNameBn}
            </p>
            <p className={`mt-1 text-xs font-semibold ${trendColor}`}>
              {trendText}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 px-6 py-3 text-center">
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="text-3xl font-extrabold text-gray-900">{bn(today)}</p>
          <p className="text-xs text-gray-500">টাকা / {unit}</p>
          <p className={`mt-1 text-xs font-bold ${trendColor}`}>
            {isUp ? "▲" : isDown ? "▼" : "—"} {bn(Math.abs(pct), 1)}%
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-gray-900">
          দামের সারসংক্ষেপ
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>
            <p className="mt-1 text-2xl font-extrabold text-green-600">
              {lowest ? bn(lowest.min) : "—"}{" "}
              <span className="text-sm font-medium">টাকা</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {lowest ? `${lowest.market}-এ সবচেয়ে কম দাম` : "তথ্য নেই"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">সর্বোচ্চ দাম</p>
            <p className="mt-1 text-2xl font-extrabold text-red-600">
              {highest ? bn(highest.max) : "—"}{" "}
              <span className="text-sm font-medium">টাকা</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {highest ? `${highest.market}-এ সবচেয়ে বেশি দাম` : "তথ্য নেই"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">গড় দাম</p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">
              {bn(today)} <span className="text-sm font-medium">টাকা</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">প্রতি {unit}-এর হিসাব</p>
          </div>
        </div>
      </section>

      {/* Market-wise table */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <p className="text-sm text-gray-500">
            এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2.5 font-medium">বাজার</th>
                  <th className="px-3 py-2.5 font-medium">বিভাগ</th>
                  <th className="px-3 py-2.5 text-right font-medium">
                    সর্বনিম্ন
                  </th>
                  <th className="px-3 py-2.5 text-right font-medium">
                    সর্বোচ্চ
                  </th>
                  <th className="px-3 py-2.5 text-right font-medium">গড়</th>
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
                      <td className="px-3 py-3 font-medium text-gray-900">
                        {m.market}
                      </td>
                      <td className="px-3 py-3 text-gray-600">{m.division}</td>
                      <td className="px-3 py-3 text-right text-gray-700">
                        {bn(m.min)} টাকা
                      </td>
                      <td className="px-3 py-3 text-right text-gray-700">
                        {bn(m.max)} টাকা
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-gray-900">
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