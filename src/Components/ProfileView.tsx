"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const input =
  "w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

export default function ProfileView() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (session?.user.name) {
      setName(session.user.name);
    }
  }, [session?.user.name]);

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const trimmed = name.trim();

    if (!trimmed) {
      const text = "নাম খালি রাখা যাবে না";

      setMessage({ type: "err", text });
      toast.error(text);
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: trimmed,
      });

      if (error) {
        const text = error.message || "আপডেট করা যায়নি";

        setMessage({ type: "err", text });
        toast.error(text);
        return;
      }

      const text = "প্রোফাইল আপডেট হয়েছে";

      setMessage({ type: "ok", text });
      toast.success(text);

      router.refresh();
    } catch {
      const text = "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।";

      setMessage({ type: "err", text });
      toast.error(text);
    } finally {
      setSaving(false);
    }
  }

  async function onSignOut() {
    if (signingOut) return;

    setSigningOut(true);
    setMessage(null);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        const text = error.message || "সাইন আউট করা যায়নি";

        setMessage({ type: "err", text });
        toast.error(text);
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে!");

      router.push("/");
      router.refresh();
    } catch {
      const text = "সাইন আউট করতে সমস্যা হয়েছে";

      setMessage({ type: "err", text });
      toast.error(text);
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-2xl px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
        <div className="h-7 w-40 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-48" />
        <div className="mt-5 h-24 animate-pulse rounded-2xl bg-gray-100 sm:mt-6" />
        <div className="mt-4 h-56 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (!session) return null;

  const { user } = session;
  const changed = name.trim() !== user.name;

  return (
    <section className="mx-auto w-full max-w-2xl px-3 py-5 sm:px-5 sm:py-8 lg:px-6">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
          আমার প্রোফাইল
        </h1>

        <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
          আপনার অ্যাকাউন্টের তথ্য দেখুন ও আপডেট করুন।
        </p>
      </div>

      {/* User card */}
      <div className="mt-5 flex min-w-0 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between sm:mt-6 sm:gap-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-gray-900 sm:text-base">
            {user.name}
          </p>

          <p className="mt-1 break-all text-xs text-gray-500 sm:text-sm">
            {user.email}
          </p>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          disabled={signingOut || saving}
          className="w-full shrink-0 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 min-[400px]:w-auto sm:px-4 sm:py-2.5 sm:text-sm"
        >
          {signingOut ? "সাইন আউট হচ্ছে..." : "↩ সাইন আউট"}
        </button>
      </div>

      {/* Profile form */}
      <form
        onSubmit={onSave}
        className="mt-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:mt-5 sm:p-5"
      >
        <h2 className="text-base font-bold text-gray-900 sm:text-lg">
          ব্যক্তিগত তথ্য
        </h2>

        <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
          {/* Name */}
          <div className="min-w-0">
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-semibold text-gray-700 sm:text-sm"
            >
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setMessage(null);
              }}
              placeholder="আপনার নাম"
              className={input}
              maxLength={100}
              required
            />
          </div>

          {/* Email */}
          <div className="min-w-0">
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold text-gray-700 sm:text-sm"
            >
              ইমেইল
            </label>

            <input
              id="email"
              type="email"
              value={user.email}
              readOnly
              className={`${input} cursor-not-allowed bg-gray-100 text-gray-500`}
            />

            <p className="mt-1 text-[11px] leading-relaxed text-gray-400 sm:text-xs">
              বর্তমানে ইমেইল পরিবর্তন করা যাবে না।
            </p>
          </div>

          {/* Success / Error message */}
          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`break-words rounded-lg px-3 py-2 text-xs leading-relaxed sm:text-sm ${
                message.type === "ok"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          {/* Update button */}
          <button
            type="submit"
            disabled={saving || !changed || signingOut}
            className="w-full rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3"
          >
            {saving ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
          </button>
        </div>
      </form>
    </section>
  );
}