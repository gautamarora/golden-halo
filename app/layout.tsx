import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

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
    <html lang="en" className="dark">
      <body className="antialiased bg-gray-950 transition-colors">
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
