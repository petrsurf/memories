import type { Metadata } from "next";
import { CSSProperties } from "react";
import {
  Bodoni_Moda,
  Cormorant_Garamond,
  DM_Serif_Display,
  Fraunces,
  IBM_Plex_Sans,
  Lora,
  Manrope,
  Merriweather,
  Nunito_Sans,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Source_Sans_3,
  Space_Grotesk,
  Work_Sans,
} from "next/font/google";
import "./globals.css";

const displayPlayfair = Playfair_Display({
  variable: "--font-display-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const displayFraunces = Fraunces({
  variable: "--font-display-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const displayCormorant = Cormorant_Garamond({
  variable: "--font-display-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const displayDmSerif = DM_Serif_Display({
  variable: "--font-display-dmserif",
  subsets: ["latin"],
  weight: ["400"],
});

const displayBodoni = Bodoni_Moda({
  variable: "--font-display-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const displayLora = Lora({
  variable: "--font-display-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const displayMerriweather = Merriweather({
  variable: "--font-display-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const displaySpaceGrotesk = Space_Grotesk({
  variable: "--font-display-spacegrotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyManrope = Manrope({
  variable: "--font-body-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bodyWorkSans = Work_Sans({
  variable: "--font-body-worksans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bodySourceSans = Source_Sans_3({
  variable: "--font-body-sourcesans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bodyIbmPlex = IBM_Plex_Sans({
  variable: "--font-body-ibmplex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bodyNunito = Nunito_Sans({
  variable: "--font-body-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyJakarta = Plus_Jakarta_Sans({
  variable: "--font-body-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      <body
        className={`${displayPlayfair.variable} ${displayFraunces.variable} ${displayCormorant.variable} ${displayDmSerif.variable} ${displayBodoni.variable} ${displayLora.variable} ${displayMerriweather.variable} ${displaySpaceGrotesk.variable} ${bodyManrope.variable} ${bodyWorkSans.variable} ${bodySourceSans.variable} ${bodyIbmPlex.variable} ${bodyNunito.variable} ${bodyJakarta.variable} antialiased`}
        style={
          {
            "--font-display": "var(--font-display-playfair)",
            "--font-body": "var(--font-body-manrope)",
          } as CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
