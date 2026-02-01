import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SONNET POS | Cloud Point of Sale",
    description: "Modern, secure, and efficient cloud-based POS system for retail and services.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-background-app text-text-primary antialiased`}>
                {children}
            </body>
        </html>
    );
}
