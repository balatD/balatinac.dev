import '@/globals.css';
import { GeistMono } from 'geist/font/mono';
import PlausibleProvider from 'next-plausible';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <PlausibleProvider customDomain="https://analytics.balatinac.dev" domain="balatinac.dev" selfHosted={true} />
            </head>
            <body className={GeistMono.variable}>{children}</body>
        </html>
    );
}
