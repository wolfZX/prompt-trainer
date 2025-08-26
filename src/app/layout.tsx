import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Prompt Trainer - Master the Art of AI Communication",
  description: "Learn to write better AI prompts with gamification, real-time feedback, and achievement tracking. Improve your AI communication skills through interactive training.",
  keywords: "AI prompts, prompt engineering, AI communication, chatGPT training, AI skills, prompt optimization",
  authors: [{ name: "AI Prompt Trainer" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff6b35',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased gradient-bg min-h-screen`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
