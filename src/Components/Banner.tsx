
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
      <div className="relative flex flex-col-reverse items-center justify-between gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50 px-4 py-5 shadow-sm ring-1 ring-green-100 sm:gap-5 sm:px-6 sm:py-7 md:flex-row md:gap-6 md:px-8 lg:gap-8 lg:px-10 lg:py-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-green-200/40 blur-3xl sm:size-56" />

        {/* Text content */}
        <div className="relative z-10 w-full min-w-0 flex-1 text-center md:text-left">
          <span className="inline-block max-w-full rounded-full bg-green-100 px-3 py-1 text-xs font-semibold leading-relaxed text-green-700 sm:text-sm">
            {date}
          </span>

          <h1 className="mt-3 text-2xl font-extrabold leading-snug text-gray-900 min-[400px]:text-3xl sm:leading-tight lg:text-4xl">
            আজকের বাজারের দাম{" "}
            <span className="text-green-600">এক নজরে</span>
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base md:mx-0">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের দাম এবং
            গতকালের তুলনায় দামের পরিবর্তন এক জায়গায়।
          </p>

          <Link
            href="/#all-products"
            className="mt-4 inline-flex max-w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-95 sm:px-5"
          >
            <span>সব পণ্য দেখুন</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Banner image */}
        <div className="relative z-10 h-36 w-full max-w-[220px] shrink-0 sm:h-48 sm:max-w-xs md:h-48 md:w-[42%] md:max-w-sm lg:h-60 lg:w-[40%] lg:max-w-96">
          <Image
            src="/bazar-hero.png"
            alt="আজকের বাজারের দাম"
            fill
            priority
            sizes="(max-width: 399px) 220px, (max-width: 767px) 320px, (max-width: 1023px) 42vw, 384px"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;