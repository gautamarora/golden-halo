'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Halo', path: '/', icon: '◉' },
  { name: 'Goals', path: '/goals', icon: '⊙' },
  { name: 'Tracker', path: '/tracker', icon: '▣' },
  { name: 'Journal', path: '/journal', icon: '◈' },
  { name: 'Coach', path: '/coach', icon: '◐' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 safe-area-inset-bottom">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? 'text-golden'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <span className="text-2xl mb-0.5">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
