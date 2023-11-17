import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
    title: 'balatinac.dev - coming soon...',
    description: 'coming soon...',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={GeistMono.variable}>{children}</body>
        </html>
    );
}
