import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Ini sudah diubah menjadi JavaScript biasa dan ditambah manifest PWA
export const metadata = {
  title: "Global Music Pulse",
  description: "Analisis tren musik global menggunakan Big Data",
  manifest: "/manifest.json",
};

// Bagian ini juga sudah dibersihkan dari syntax TypeScript
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}