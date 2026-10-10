type Product = {
  id: number;
  slug: string;
  nameBn: string;
  categoryIcon: string;
  image: string;
  today: number;
  yesterday: number;
  unit: string;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/products",
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

const bn = (n: number, digits = 0) =>
  n.toLocaleString("bn-BD", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export default async function AllProducts() {
  const products = await getProducts();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
      <p className="mb-4 mt-1 text-xs text-gray-500">
        মোট {bn(products.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
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
            <article
              key={product.id}
              className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm transition hover:shadow-md"
            >
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
                      {product.categoryIcon || "🛒"}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-gray-900">
                    {product.nameBn}
                  </h3>
                  <p className="text-xs text-gray-500">প্রতি {product.unit}</p>
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
          );
        })}
      </div>
    </section>
  );
}