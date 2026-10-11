
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
    "https://api.api-store.workers.dev/api/bazardor/products"
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

export default async function PriceMarquee() {
  const products = await getProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="পণ্যের বর্তমান দাম ও দামের পরিবর্তন"
      className="group w-full overflow-hidden border-y border-gray-200 bg-white"
    >
      <div className="flex w-max animate-marquee-fast motion-reduce:animate-none group-hover:[animation-play-state:paused] sm:animate-marquee">
        {[0, 1].map((copy) => (
          <div
            className="flex shrink-0 items-center"
            key={copy}
            aria-hidden={copy === 1}
          >
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
                <article
                  className="flex shrink-0 items-center gap-1.5 whitespace-nowrap border-r border-gray-200 px-2.5 py-2 text-xs min-[400px]:gap-2 min-[400px]:px-3 sm:px-4 sm:py-2.5 sm:text-sm lg:gap-2.5"
                  key={`${copy}-${product.id}`}
                >
                  {/* Product image or category icon */}
                  <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-xs sm:size-6">
                    {validImage ? (
                      <img
                        src={product.image}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : (
                      <span>{product.categoryIcon || "🛒"}</span>
                    )}
                  </span>

                  {/* Product name */}
                  <h3 className="font-semibold text-gray-900">
                    {product.nameBn}
                  </h3>

                  {/* Current price */}
                  <span className="text-gray-600">
                    {bn(today)} টাকা/{product.unit}
                  </span>

                  {/* Price change */}
                  <span
                    className={`font-bold ${
                      isUp
                        ? "text-red-600"
                        : isDown
                          ? "text-green-600"
                          : "text-slate-500"
                    }`}
                  >
                    {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                    {bn(Math.abs(change), 1)}%
                  </span>
                </article>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}