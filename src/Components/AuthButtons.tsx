"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthButtons() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // বাইরে click করলে বা Escape চাপলে dropdown বন্ধ
  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function onSignOut() {
    setSigningOut(true);

    try {
      await authClient.signOut();
      setOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  // Session loading
  if (isPending) {
    return (
      <div
        className="h-9 w-20 animate-pulse rounded-lg bg-gray-200 sm:w-28"
        aria-label="অপেক্ষা করুন"
      />
    );
  }

  // Logged in
  if (session) {
    const fullName = session.user.name || "ব্যবহারকারী";
    const firstName = fullName.trim().split(/\s+/)[0];

    return (
      <div ref={wrapRef} className="relative min-w-0">
        {/* User dropdown trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="ব্যবহারকারীর মেনু"
          className="flex max-w-full items-center gap-1.5 rounded-lg px-1.5 py-1.5 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 sm:gap-2 sm:px-2"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
            {fullName.charAt(0).toUpperCase()}
          </span>

          <span className="max-w-[5rem] truncate text-xs font-medium text-gray-800 min-[400px]:max-w-[7rem] sm:max-w-[8rem] sm:text-sm">
            {firstName}
          </span>

          <span
            aria-hidden="true"
            className={`shrink-0 text-[10px] text-gray-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* Dropdown menu */}
        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full z-[100] mt-2 w-[min(14rem,calc(100vw-1.5rem))] rounded-xl border border-gray-200 bg-white p-3 shadow-lg"
          >
            {/* User information */}
            <div className="min-w-0 border-b border-gray-100 pb-2.5">
              <p className="truncate text-sm font-bold text-gray-900">
                {fullName}
              </p>

              <p className="break-all text-xs text-gray-500">
                {session.user.email}
              </p>
            </div>

            <div className="mt-2 space-y-0.5">
              {/* Profile */}
              <Link
                href="/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              >
                <span aria-hidden="true">👤</span>
                <span>আমার প্রোফাইল</span>
              </Link>

              {/* Sign out */}
              <button
                type="button"
                role="menuitem"
                onClick={onSignOut}
                disabled={signingOut}
                className="flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span aria-hidden="true">↩</span>
                <span>
                  {signingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not logged in
  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <Link
        href="/signin"
        className="whitespace-nowrap rounded-lg border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 min-[400px]:px-3 sm:text-sm"
      >
        সাইন ইন
      </Link>

      <Link
        href="/signup"
        className="whitespace-nowrap rounded-lg bg-green-700 px-2 py-2 text-xs font-semibold text-white transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 min-[400px]:px-3 sm:text-sm"
      >
        সাইন আপ
      </Link>
    </div>
  );
}