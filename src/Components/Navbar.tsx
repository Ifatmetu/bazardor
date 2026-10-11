
import Image from "next/image";
import Link from "next/link";
import Navlinks from "./Navlinks";
import AuthButtons from "./AuthButtons";

const Navbar = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });

  return (
    <header className="relative z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:px-5 md:gap-4 lg:px-6">
        {/* Logo and Auth buttons */}
        <div className="flex w-full min-w-0 items-center justify-between gap-2 md:gap-4">
          {/* Logo and date */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 sm:gap-3"
          >
            <Image
              className="size-9 shrink-0 rounded-lg bg-green-500 object-contain sm:size-10"
              src="/logo-icon.png"
              alt="বাজার দর"
              width={40}
              height={40}
              priority
            />

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold leading-tight text-gray-900 sm:text-lg">
                বাজার দর
              </h2>

              <p className="mt-0.5 max-w-full text-[10px] leading-relaxed text-gray-500 sm:text-xs">
                {date}
              </p>
            </div>
          </Link>

          {/* Authentication buttons */}
          <div className="flex shrink-0 items-center justify-end">
            <AuthButtons />
          </div>
        </div>

        {/* Navigation links */}
        <nav className="w-full min-w-0">
          <Navlinks />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
