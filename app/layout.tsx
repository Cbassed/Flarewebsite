import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  title: {
    default: "Flare",
    template: "%s | Flare"
  },
  description: "A platform for helping you reach discovery",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: { url: '/apple-icon.png' },
  },
  // Add OpenGraph metadata for link sharing
  openGraph: {
    title: "Flare",
    description: "A platform for helping you reach discovery",
    url: "https://www.getflareapp.com/", // Replace with your actual URL
    siteName: "Flare",
    images: [
      {
        url: "/website-preview.png", // Your screenshot image
        width: 1200, // Adjust to match your screenshot dimensions
        height: 630, // Adjust to match your screenshot dimensions
        alt: "Flare Website",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Add Twitter card metadata
  twitter: {
    card: "summary_large_image",
    title: "Flare",
    description: "A platform for helping you reach discovery",
    images: ["/website-preview.png"], // Same image as OpenGraph
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
        <SpeedInsights />
      </body>
    </html>
  );
}