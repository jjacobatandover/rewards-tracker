import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Credit Card Perks Tracker',
  description: 'Track and maximize your credit card benefits',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
