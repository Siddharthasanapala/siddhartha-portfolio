import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, themeInitScript } from "@/components/theme/ThemeProvider";
import { MotionProvider } from "@/components/theme/MotionProvider";
import { ChatLauncher } from "@/components/chatbot/ChatLauncher";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { ChatWidgetProvider } from "@/components/chatbot/ChatWidgetProvider";
import { ScrollProgress } from "@/components/ui";
import { profile } from "@/data/profile";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
const title = `${profile.name} — Platform / DevOps Engineer`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: profile.positioning,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title,
    description: profile.positioning,
    url: siteUrl,
    siteName: `${profile.name} — Portfolio`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.positioning,
  },
};

// name, jobTitle, url, sameAs (LinkedIn/GitHub) — no telephone property, per
// Build Spec §9. sameAs only includes URLs that actually exist (Build Spec
// §6.0: linkedinUrl/githubUrl are empty until supplied — never fabricate).
const sameAs = [profile.linkedinUrl, profile.githubUrl].filter(Boolean);

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Platform / DevOps Engineer",
  url: siteUrl,
  description: profile.positioning,
  ...(sameAs.length > 0 ? { sameAs } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Blocking inline script: applies the stored theme before first paint to avoid a flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <ThemeProvider>
            <ScrollProgress />
            <ChatWidgetProvider>
              {children}
              <ChatLauncher />
              <ChatWidget />
            </ChatWidgetProvider>
          </ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
