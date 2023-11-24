import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

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
