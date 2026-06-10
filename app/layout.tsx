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

export const metadata: Metadata = {
  title: "AI Research Workspace",
  description: "RAG Research Assistant",
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
