import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pupperazi Pet Spa - Dog Grooming in Palm Harbor, FL",
  description: "Pupperazi Pet Spa offers boutique-style dog grooming in Palm Harbor, FL. Pamper your pup with premium baths, haircuts, nail trims, and more. Where every pet gets the VIP treatment.",
  keywords: [
    "dog grooming Palm Harbor FL",
    "pet grooming Palm Harbor",
    "dog spa Florida",
    "pet salon Palm Harbor",
    "dog bathing Palm Harbor",
    "nail trimming dogs",
    "professional dog grooming",
    "pet boarding Palm Harbor",
    "Pupperazi Pet Spa"
  ],
  authors: [{ name: "Pupperazi Pet Spa" }],
  creator: "Pupperazi Pet Spa",
  publisher: "Pupperazi Pet Spa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://pupperazi-pet-spa.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pupperazi Pet Spa - Dog Grooming in Palm Harbor, FL",
    description: "Boutique-style dog grooming in Palm Harbor, FL. Pamper your pup with premium baths, haircuts, nail trims, and more. Where every pet gets the VIP treatment.",
    url: "https://pupperazi-pet-spa.vercel.app",
    siteName: "Pupperazi Pet Spa",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/gallery/pet1.png",
        width: 1200,
        height: 630,
        alt: "Professional dog grooming at Pupperazi Pet Spa in Palm Harbor, FL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pupperazi Pet Spa - Dog Grooming in Palm Harbor, FL",
    description: "Boutique-style dog grooming in Palm Harbor, FL. Where every pet gets the VIP treatment.",
    images: ["/gallery/pet1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href={`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>`}
        />
      </head>
      <body
        className={`${playfairDisplay.variable} ${nunito.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
