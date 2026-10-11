"use client";

import { usePathname, useRouter } from "next/navigation";

const OPTIONS = [
  { value: "default", label: "ডিফল্ট" },
  { value: "low", label: "দাম: কম থেকে বেশি" },
  { value: "high", label: "দাম: বেশি থেকে কম" },
];

export default function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    router.replace(next === "default" ? pathname : `${pathname}?sort=${next}`, {
      scroll: false,
    });
  }

  return (
    <label className="flex items-center gap-2 text-sm text-gray-500">
      সাজান
      <select
        value={value}
        onChange={onChange}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}