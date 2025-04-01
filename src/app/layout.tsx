import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Navbar from "@components/NavBar";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Fleeto",
  description: "FLEETO DOESN'T NEED ANY DESCRIPTION 😒",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} flex flex-col items-top justify-center pb-[80px]`}>
        <div className="relative flex flex-col items-center justify-top w-full h-full max-w-[1440px] overflow-x-clip">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
