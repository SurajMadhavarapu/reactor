'use client';

import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { THEME } from "@/app/utils/constants";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <title>REACTOR - Startup Ideas Platform</title>
        <meta name="description" content="Share, discuss, and collaborate on startup ideas with the power of REACTOR" />
      </head>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: THEME.colors.cream, color: THEME.colors.charcoal }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
