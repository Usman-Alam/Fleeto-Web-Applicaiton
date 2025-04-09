import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { CartProvider } from "@contexts/CartContext";
import ClientLayout from "@components/ClientLayout";

const inter = Inter({
  subsets: ['latin'],
  weight: ["400", "700"],
  display: 'swap',
  adjustFontFallback: false,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fleeto",
  description: "FLEETO DOESN'T NEED ANY DESCRIPTION 😒",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} flex flex-col items-top justify-center pb-[80px]`}>
        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
