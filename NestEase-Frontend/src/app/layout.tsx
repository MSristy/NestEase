import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/context/ThemeProvider";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from '@/context/NotificationContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NestEase - Unified Home Solutions Platform",
  description: "Find properties, book home services, and swap items all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <CartProvider>
            <NotificationProvider>
              <Navbar />
              <main className="flex-grow pt-24">{children}</main>
              <Footer />
              <Toaster />
            </NotificationProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
