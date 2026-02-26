import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://better-registry.com",
  ),
  title: "better-registry — The shadcn for AI",
  description:
    "Open-source, SDK-agnostic AI tools and agents. Install with one command, own the source code.",
  openGraph: {
    title: "better-registry — The shadcn for AI",
    description:
      "Open-source, SDK-agnostic AI tools and agents. Install with one command, own the source code.",
    type: "website",
    siteName: "better-registry",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "better-registry — The shadcn for AI",
    description:
      "Open-source, SDK-agnostic AI tools and agents. Install with one command, own the source code.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
