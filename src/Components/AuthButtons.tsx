"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthButtons() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          {session.user.name}
        </span>
        <button
          onClick={async () => {
            await authClient.signOut();
            router.refresh();
          }}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          সাইন আউট
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/signin"
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        সাইন ইন
      </Link>
      <Link
        href="/signup"
        className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-800"
      >
        সাইন আপ
      </Link>
    </div>
  );
}