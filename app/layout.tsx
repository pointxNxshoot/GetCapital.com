import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const BASE_URL = "https://get-capital.com.au";

export const metadata: Metadata = {
  title: {
    default: "Get Capital — Buy & Sell Australian Businesses",
    template: "%s — Get Capital",
  },
  description: "Australia's marketplace for buying and selling small businesses. Get a data-driven valuation, list confidentially, and connect with verified buyers.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: BASE_URL,
    siteName: "Get Capital",
    title: "Get Capital — Buy & Sell Australian Businesses",
    description: "Australia's marketplace for buying and selling small businesses. Get a data-driven valuation, list confidentially, and connect with verified buyers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Capital — Buy & Sell Australian Businesses",
    description: "Australia's marketplace for buying and selling small businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
