import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import { CartProvider } from "@contexts/CartContext";
import Navbar from "@components/NavBar/NavBar";
import SessionProvider from "@providers/SessionProvider";
import { AuthProvider } from "@contexts/AuthContext";
import Footer from "@components/Footer";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.variable} flex flex-col items-top justify-center`}>
        {/* <SessionProvider>
          <AuthProvider> */}
            <CartProvider>
              <div className="relative flex flex-col items-center justify-top w-full h-full overflow-x-clip">
                <Navbar />
                {children}
                <Footer />
              </div>
            </CartProvider>
          {/* </AuthProvider>
        </SessionProvider> */}
      </body>
    </html>
  );
}
