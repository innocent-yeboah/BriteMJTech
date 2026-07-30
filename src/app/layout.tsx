import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ParticleCanvas } from "@/components/effects/particle-canvas";
import { OrganizationJsonLd } from "@/components/structured-data";
import { siteConfig } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Security & Smart Systems in Accra`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "CCTV installation Accra",
    "security and electric fencing Ghana",
    "perimeter fencing Accra",
    "video intercom Ghana",
    "remote gate control",
    "networking installation Accra",
    "smart security systems Ghana",
    "Brite MJ Technologies",
    "Spintex security company",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "security",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Security & Smart Systems in Accra`,
    description: siteConfig.description,
    images: [
      {
        url: "/images/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "Brite MJ Technologies security installation team in Accra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Security & Smart Systems in Accra`,
    description: siteConfig.description,
    images: ["/images/og/default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/images/logo/mj-mark.png", type: "image/png" }],
    apple: [{ url: "/images/logo/mj-mark.png" }],
    shortcut: ["/images/logo/mj-mark.png"],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0A2540",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GH"
      className={`${inter.variable} ${montserrat.variable} ${playfair.variable}`}
    >
      <body className="relative flex min-h-screen flex-col">
        <ParticleCanvas />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-950 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <WhatsAppButton />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
