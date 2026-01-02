import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import DarkModeToggle from "@/components/DarkModeToggle";

export const metadata: Metadata = {
  title: "Halo",
  description: "A single AI health dashboard for fitness goals and tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white dark:bg-gray-950 transition-colors">
        <DarkModeToggle />
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
