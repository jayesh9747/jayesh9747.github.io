import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OSChrome } from "@/components/os/OSChrome";
import { profile } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://jayesh9747.github.io";

/**
 * Static file rather than a generated `opengraph-image` route: under
 * `output: "export"` that route emits an extension-less file, which GitHub
 * Pages serves as application/octet-stream — and every social crawler
 * rejects a non-image content type, so the card renders blank.
 */
const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${profile.name} — ${profile.role}`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.os}`,
  },
  description: profile.tagline,
  keywords: [
    "Freelance Full-Stack Developer",
    "AI Engineer",
    "React Native Developer",
    "AI Agents",
    "MCP",
    "Next.js",
    "Node.js",
    "Kubernetes",
    profile.name,
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: `${siteUrl}/` },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    siteName: profile.os,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    images: [ogImage.url],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04050a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        <OSChrome>{children}</OSChrome>
      </body>
    </html>
  );
}
