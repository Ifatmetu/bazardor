export type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  image: string;
  unit: string;
  today: number;
  yesterday: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: { dir: "up" | "down" | "flat"; pct: number };
  markets?: Market[];
};

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(API_URL, { next: { revalidate: 300 } });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const json = await res.json();

  // array, { data: [...] } ba { products: [...] } sob handle kore
  const list = Array.isArray(json) ? json : (json?.data ?? json?.products ?? []);

  return list as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}