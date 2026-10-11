"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const input =
  "w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100";

const label = "mb-1.5 block text-sm font-semibold text-gray-800";

const SignUpContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextParam = searchParams.get("next") ?? "/";
  const next =
    nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (!name || !email || !password || !confirm) {
      const message = "সবগুলো ঘর পূরণ করুন";
      setError(message);
      toast.error(message);
      return;
    }

    if (password.length < 8) {
      const message = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
      setError(message);
      toast.error(message);
      return;
    }

    if (password !== confirm) {
      const message = "পাসওয়ার্ড দুটি মিলছে না";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: next,
      });

      if (error) {
        const message =
          error.message || "অ্যাকাউন্ট তৈরি করা যায়নি";

        setError(message);
        toast.error(message);
        setLoading(false);
        return;
      }

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");

      router.push(next);
      router.refresh();
    } catch {
      const message = "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন.";
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  }

  async function social(provider: "google" | "github") {
    setError("");
    setSocialLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: next,
      });

      if (error) {
        const message =
          error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে";

        setError(message);
        toast.error(message);
        setSocialLoading(false);
      }
    } catch {
      const message = "লগইন করা যায়নি। আবার চেষ্টা করুন.";
      setError(message);
      toast.error(message);
      setSocialLoading(false);
    }
  }

  return (
    <main className="flex w-full flex-1 items-start justify-center px-3 py-6 sm:px-5 sm:py-10">
      <div className="w-full max-w-md min-w-0">
        {/* Heading */}
        <div className="mb-5 text-center sm:mb-6">
          <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-gray-500 sm:text-sm">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>
        </div>

        {/* Signup form */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6"
        >
          {/* Name */}
          <div className="min-w-0">
            <label htmlFor="name" className={label}>
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="যেমন: রহিম উদ্দিন"
              className={input}
            />
          </div>

          {/* Email */}
          <div className="min-w-0">
            <label htmlFor="email" className={label}>
              ইমেইল
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className={input}
            />
          </div>

          {/* Password */}
          <div className="min-w-0">
            <label htmlFor="password" className={label}>
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className={input}
            />
          </div>

          {/* Confirm password */}
          <div className="min-w-0">
            <label htmlFor="confirm" className={label}>
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="আবার লিখুন"
              className={input}
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              role="alert"
              className="break-words rounded-lg bg-red-50 px-3 py-2 text-sm leading-relaxed text-red-600"
            >
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || socialLoading}
            className="w-full rounded-lg bg-green-700 px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="shrink-0 text-xs text-gray-500">
              অথবা
            </span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 sm:gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => social("google")}
              disabled={loading || socialLoading}
              className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-xs font-semibold leading-snug text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-sm"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4 shrink-0"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z"
                />
              </svg>

              <span className="min-w-0 break-words">
                Google দিয়ে চালিয়ে যান
              </span>
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => social("github")}
              disabled={loading || socialLoading}
              className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-xs font-semibold leading-snug text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-sm"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4 shrink-0"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
              </svg>

              <span className="min-w-0 break-words">
                GitHub দিয়ে চালিয়ে যান
              </span>
            </button>
          </div>

          {/* Sign in link */}
          <p className="text-center text-xs leading-relaxed text-gray-700 sm:text-sm">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href={`/signin?next=${encodeURIComponent(next)}`}
              className="font-semibold text-green-700 hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </form>

        {/* Back home */}
        <p className="mt-5 text-center text-xs text-gray-500 sm:mt-6 sm:text-sm">
          <Link
            href="/"
            className="hover:text-gray-700 hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </p>
      </div>
    </main>
  );
};

const SignUp = () => {
  return (
    <Suspense fallback={null}>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUp;
