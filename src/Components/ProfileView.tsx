"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const input =
  "w-full rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100";

export default function ProfileView() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (session?.user.name) setName(session.user.name);
  }, [session?.user.name]);

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setMessage({ type: "err", text: "নাম খালি রাখা যাবে না" });
      return;
    }

    setSaving(true);
    const { error } = await authClient.updateUser({ name: trimmed });
    setSaving(false);

    if (error) {
      setMessage({
        type: "err",
        text: error.message || "আপডেট করা যায়নি",
      });
      return;
    }

    setMessage({ type: "ok", text: "প্রোফাইল আপডেট হয়েছে" });
    router.refresh();
  }

  async function onSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 h-20 animate-pulse rounded-2xl bg-white" />
        <div className="mt-4 h-48 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (!session) return null;

  const { user } = session;
  const changed = name.trim() !== user.name;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900">আমার প্রোফাইল</h1>
      <p className="mt-1 text-xs text-gray-500">
        আপনার অ্যাকাউন্টের তথ্য প্রদর্শন দেখুন।
      </p>

      {/* User card */}
      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-gray-900">
            {user.name}
          </p>
          <p className="truncate text-sm text-gray-500">{user.email}</p>
        </div>

        <button
          onClick={onSignOut}
          className="shrink-0 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 sm:text-sm"
        >
          ↩ সাইন আউট
        </button>
      </div>

      {/* Info form */}
      <form
        onSubmit={onSave}
        className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-base font-bold text-gray-900">তথ্য</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-semibold text-gray-700"
            >
              নাম
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম"
              className={input}
            />
          </div>

          {message && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                message.type === "ok"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !changed}
            className="w-full rounded-lg bg-green-700 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
          </button>
        </div>
      </form>
    </section>
  );
}