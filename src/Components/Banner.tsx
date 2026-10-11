import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="relative flex flex-col-reverse items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50 px-6 py-6 shadow-sm ring-1 ring-green-100 md:flex-row md:gap-8 md:px-10 md:py-8">
        {/* decorative blob */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-green-200/40 blur-3xl" />

        {/* Text */}
        <div className="relative z-10 flex-1 text-center md:text-left">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 sm:text-sm">
            {date}
          </span>

          <h1 className="mt-3 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
            আজকের বাজারের দাম{" "}
            <span className="text-green-600">এক নজরে</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের দাম এবং
            গতকালের তুলনায় দামের পরিবর্তন এক জায়গায়।
          </p>

          <Link
            href="/#all-products"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-95"
          >
            সব পণ্য দেখুন
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Image */}
        <div className="relative z-10 h-40 w-full max-w-xs shrink-0 sm:h-48 sm:max-w-sm md:h-56 md:w-80 lg:h-60 lg:w-96">
          <Image
            src="/bazar-hero.png"
            alt="আজকের বাজারের দাম"
            fill
            priority
            sizes="(max-width: 768px) 320px, 384px"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;