import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/ui/providers/ThemeProvider";
import { AuthProvider } from "@/ui/features/auth/context/AuthContext";
import { CartProvider } from "@/ui/features/cart/context/CartContext";
import { StatusBanner } from "@/ui/layout/StatusBanner";
import { Header } from "@/ui/layout/Header";
import { Footer } from "@/ui/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yuka Trendz | Luxury Watches, Leather Bags & Perfumes",
  description:
    "Exclusive online store for luxury timepieces, handcrafted leather bags, and fine fragrances.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-amber-500/20 selection:text-amber-700 dark:selection:text-amber-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              {/* WCAG 2.4.1 Bypass Blocks: Skip to Main Content Link */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:shadow-unt-lg focus:outline-none focus:ring-4 focus:ring-brand-500/30 font-medium text-xs tracking-wide"
              >
                Skip to main content
              </a>
              <StatusBanner />
              <Header />
              <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
