import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Manoj Bhatt - Digital Innovator & Web Designer",
  description: "Portfolio of Manoj Bhatt, a passionate creator of cutting-edge digital solutions and stunning web designs",
  icons: {
    icon: [
      {
        url: "/logo.gif",
        type: "image/gif",
      },
    ],
    apple: [
      {
        url: "/logo.gif",
        type: "image/gif",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.gif" type="image/gif" />
      </head>
      <body>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}