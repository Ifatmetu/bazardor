
import Link from "next/link";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProducts(slug: string): Promise<Product[]> {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/products?category=" + slug
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const products = await getProducts(slug);

  const categoryName =
    products[0]?.categoryNameBn ?? "পণ্য পাওয়া যায়নি";

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-6">
      <Link
        href="/"
        className="mb-6 inline-block text-green-600 hover:underline"
      >
        ← হোমে ফিরে যাও
      </Link>

      <h1 className="mb-6 text-3xl font-bold">
        {categoryName}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex h-32 items-center justify-center">
                {product.image &&
                /^https?:\/\/\S+$/i.test(product.image) ? (
                  <img
                    src={product.image}
                    alt={product.nameBn}
                    className="h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-5xl">
                    {product.categoryIcon}
                  </span>
                )}
              </div>

              <h2 className="font-semibold text-gray-800">
                {product.nameBn}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                একক: {product.unit}
              </p>

              <p className="mt-2 font-bold text-green-600">
                আজকের দাম: {product.today} টাকা
              </p>

              <p className="mt-1 text-sm text-gray-500">
                গতকালের দাম: {product.yesterday} টাকা
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
