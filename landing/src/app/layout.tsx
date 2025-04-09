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
  title: "Dark AI",
  description: "Discover Dark AI, an innovative mobile app. Unleash the power of cutting-edge AI technology with a seamless, user-friendly experience—available as a Freemium service designed to enhance your daily life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="paBszcICI551hZTAeR6cK2UDA_bo7bfscgsm5hz2rQE"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-red-500`}
      >
        {children}
      </body>
    </html>
  );
}
