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
    url: "https://getflareapp.com", // Replace with your actual URL
    siteName: "Flare",
    images: [
      {
        url: "/og-image.png", // Create this image with a white background
        width: 1200,
        height: 630,
        alt: "Flare - Reach Discovery",
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
    images: ["/og-image.png"], // Same image as OpenGraph
  },
  // Theme color to white
  themeColor: "#FFFFFF",
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
