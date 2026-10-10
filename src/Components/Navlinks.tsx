
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
    <ul className="mt-3 flex flex-wrap gap-4">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/category/${category.slug}`}
            className="hover:text-green-600"
          >
            {category.icon} {category.nameBn}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Navlinks;

