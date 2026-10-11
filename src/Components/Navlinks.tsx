import Link from "next/link";

type Category = {
  id: number;
  slug: string;
  nameBn: string;
  icon: string;
};

async function Navlinks() {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/categories"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories: Category[] = await res.json();

  return (
    <ul className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 border-t border-gray-100 pt-3 text-xs sm:gap-x-5 sm:gap-y-3 sm:text-sm md:border-t-0 md:pt-0 lg:gap-x-6">
      {categories.map((category) => (
        <li key={category.id} className="shrink-0">
          <Link
            href={`/category/${category.slug}`}
            className="inline-flex items-center gap-1 rounded-md py-1 font-medium text-gray-700 transition-colors hover:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">{category.icon}</span>
            <span>{category.nameBn}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Navlinks;