"use client";

import "./globals.css";
import AuthProvider from "@/context/AuthProvder";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        
        <ThemeProvider>
          <AuthProvider>

            {/* ✅ Global Toggle */}
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>

            {children}

            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                className: "rounded-xl border shadow-lg",
              }}
            />

          </AuthProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}