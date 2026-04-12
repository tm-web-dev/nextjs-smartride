'use client';

import "./globals.css";
import AuthProvider from "@/context/AuthProvder";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
    <html
      lang="en" className={cn("font-sans", inter.variable)}
    >
      <AuthProvider>
      <body className="min-h-full flex flex-col">{children}</body>
      </AuthProvider>
    </html>
  );
}
