import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { poppins } from "@/lib/font";
import { Toaster } from "sonner";

import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import SupportWidget from "@/components/common/support-widget";

import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(poppins.variable, "font-sans antialiased")}>
        <div className="flex min-h-dvh flex-col">
          <Navbar />

          <main className="flex-1 pt-16 md:pt-20">{children}</main>

          <Footer />

          <SupportWidget />
        </div>

        <Toaster />
      </body>
    </html>
  );
}
