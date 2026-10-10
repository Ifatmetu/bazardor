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

export default async function PriceFall() {
  const products = await getProducts();

  const fallen = products
    .map((p) => {
      const today = Number(p.today);
      const yesterday = Number(p.yesterday);
      const change =
        yesterday !== 0 ? ((today - yesterday) / yesterday) * 100 : 0;
      return { ...p, today, yesterday, change };
    })
    .filter((p) => p.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  if (fallen.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
        <span className="text-sm text-green-600">▼</span>
        আজ দাম কমেছে
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fallen.map((product) => {
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

                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {product.nameBn}
                  </h3>
                  <p className="text-xs text-gray-500">প্রতি {product.unit}</p>
                </div>
              </div>

              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500">আজকের দাম</p>
                  <p className="text-lg font-extrabold text-gray-900">
                    {bn(product.today)}{" "}
                    <span className="text-sm font-medium">টাকা</span>
                  </p>
                </div>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">
                  ▼ {bn(Math.abs(product.change), 1)}%
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}