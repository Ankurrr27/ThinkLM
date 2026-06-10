import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {
  WorkspaceProvider,
} from "../components/WorkspaceProvider";
import {
  ThemeProvider,
} from "../components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── Update siteUrl to your production domain before deploying ──
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thinklm.vercel.app";
const ogImage = `${siteUrl}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // ── Title ──────────────────────────────────────────────────────
  title: {
    default: "ThinkLM — AI Research Workspace",
    template: "%s · ThinkLM",
  },

  // ── Description ────────────────────────────────────────────────
  description:
    "Upload research PDFs, organize workspaces, and ask grounded questions powered by RAG and Google Gemini. The professional AI research assistant for serious researchers.",

  // ── Canonical ──────────────────────────────────────────────────
  alternates: { canonical: "/" },

  // ── Keywords ───────────────────────────────────────────────────
  keywords: [
    "AI research assistant",
    "RAG",
    "PDF chat",
    "document intelligence",
    "Gemini",
    "research workspace",
  ],

  // ── Authors / Creator ──────────────────────────────────────────
  authors: [{ name: "ThinkLM" }],
  creator: "ThinkLM",

  // ── Open Graph (link previews on Slack, WhatsApp, LinkedIn …) ──
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ThinkLM",
    title: "ThinkLM — AI Research Workspace",
    description:
      "Upload PDFs, build workspaces, and ask grounded questions. AI-powered research, reimagined.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "ThinkLM — AI Research Workspace",
      },
    ],
  },

  // ── Twitter / X Card ───────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "ThinkLM — AI Research Workspace",
    description:
      "Upload PDFs, build workspaces, and ask grounded questions. AI-powered research, reimagined.",
    images: [ogImage],
  },

  // ── Icons ──────────────────────────────────────────────────────
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },

  // ── Theme ──────────────────────────────────────────────────────
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],

  // ── Robots ─────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem("theme") === "light" ? "light" : "dark";
                document.documentElement.dataset.theme = theme;
              } catch (error) {
                document.documentElement.dataset.theme = "dark";
              }
            `,
          }}
        />

        <ThemeProvider>
          <WorkspaceProvider>
            {children}
          </WorkspaceProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
