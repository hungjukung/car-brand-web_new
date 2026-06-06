import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "AutoDB — 台灣汽車規格資料庫", template: "%s | AutoDB" },
  description: "最完整的台灣汽車規格資料庫，提供車款比較、規格查詢、油耗計算等功能",
  keywords: ["汽車", "規格", "比較", "油耗", "台灣"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className="dark">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
