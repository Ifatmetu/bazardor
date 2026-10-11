const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-3 py-4 text-center text-xs leading-relaxed text-gray-600 sm:gap-3 sm:px-5 sm:py-5 sm:text-sm md:flex-row md:items-center md:text-left lg:px-6">
        <p className="min-w-0">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="min-w-0">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
};

export default Footer;