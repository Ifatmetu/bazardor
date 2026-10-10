import Image from "next/image";
import Link from "next/link";
import Navlinks from "./Navlinks";
import AuthButtons from "./AuthButtons";

const Navbar = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              className="h-10 w-10 rounded-lg bg-green-500 object-contain"
              src="/logo-icon.png"
              alt="বাজার দর"
              width={40}
              height={40}
            />
            <div>
              <h2 className="text-lg font-bold leading-tight text-gray-900">
                বাজার দর
              </h2>
              <p className="text-xs text-gray-500">{date}</p>
            </div>
          </Link>

          <Navlinks />
        </div>

        <AuthButtons />
      </div>
    </header>
  );
};

export default Navbar;