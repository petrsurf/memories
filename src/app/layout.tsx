import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Sunday Album",
  description: "A warm, personal space for sharing photos and videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,500,600,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Manrope:400,500,600&display=swap" rel="stylesheet" />
        {/* Add more font links as needed */}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
