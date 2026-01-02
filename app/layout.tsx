import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Golden Halo",
  description: "A single AI health dashboard for fitness goals and tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen pb-16">
          <main className="max-w-screen-lg mx-auto">
            {children}
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
