import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import { CartProvider } from "@contexts/CartContext";
import ClientLayout from "@components/ClientLayout";
import Navbar from "@components/NavBar";

// For variable font
const inter = localFont({
  src: '../../public/fonts/inter/Inter_Variable.ttf',
  variable: '--font-inter',
  display: 'swap',
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
      <body className={`${inter.variable} flex flex-col items-top justify-center pb-[80px]`}>
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
