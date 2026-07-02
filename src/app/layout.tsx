import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ef6a36",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ffpchat.vercel.app"),
  title: "FFP CHAT - Free Forever Chat",
  description:
    "Personal AI chatbot with custom personas using your own Gemini API key. Privacy-focused, locally stored, and completely free.",
  keywords: [
    "AI",
    "Persona AI",
    "Generative AI",
    "chatbot",
    "Gemini",
    "personas",
    "privacy",
    "local storage",
    "free forever chat",
    "free forever chatbot",
    "free forever ai",
  ],
  authors: [{ name: "FFP CHAT Team" }],
  creator: "FFP CHAT",
  publisher: "FFP CHAT",
  robots: "index, follow",
  openGraph: {
    title: "FFP CHAT - Free Forever Chat",
    description:
      "Your personal AI chatbot with custom personas using your own Gemini API key. 100% private and free forever.",
    url: "https://ffpchat.vercel.app",
    siteName: "FFP CHAT",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FFP CHAT - Free Forever Chat",
    description:
      "Privacy-focused AI chatbot with custom personas. Powered by your Gemini API key.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
