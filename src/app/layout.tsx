import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Navbar from "@components/NavBar";
import { CartProvider } from "@contexts/CartContext";

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

const user = {
  imageSrc: "/user.jpg",
  name: "John Doe",
  email: "johndoe@example.com",
};

// const user = null

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} flex flex-col items-top justify-center pb-[80px]`}>
        <CartProvider>
          <div className="relative flex flex-col items-center justify-top w-full h-full max-w-[1440px] overflow-x-clip">
            <Navbar user={user}/>
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
