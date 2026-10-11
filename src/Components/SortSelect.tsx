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

    router.replace(
      next === "default" ? pathname : `${pathname}?sort=${next}`,
      { scroll: false }
    );
  }

  return (
    <label className="flex w-full min-w-0 items-center gap-2 text-xs text-gray-500 sm:w-auto sm:text-sm">
      <span className="shrink-0">সাজান</span>

      <select
        value={value}
        onChange={onChange}
        aria-label="পণ্যের দাম অনুযায়ী সাজান"
        className="min-w-0 flex-1 cursor-pointer rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs font-medium text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:flex-none sm:px-3 sm:py-1.5 sm:text-sm"
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