import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Marquee from "@/Components/Marquee";
import ToasterProvider from "@/Components/ToasterProvider";
const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "বাজার দর — আজকের বাজারের দাম এক নজরে",
    template: "%s | বাজার দর",
  },
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলাসহ প্রয়োজনীয় পণ্যের আজকের দাম এবং দামের পরিবর্তন এক জায়গায়।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="h-full antialiased">
      <body
        className={`${notoSerifBengali.className} flex min-h-full flex-col bg-green-50`}
      >
        <ToasterProvider />
        <Navbar />
        <Marquee />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}