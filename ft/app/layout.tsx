import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { PortfolioProvider } from "../context/PortfolioContext";
import { ThemeProvider } from "../context/ThemeContext";
import { SidebarProvider } from "../context/SidebarContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CapitalGuard | Intelligent Asset & Capital Management",
  description: "Asset & Capital Management, Portfolio Optimization, Risk Controls, and Liquidity Management for Financial Institutions",
};

import { FloatingAiCopilot } from "../components/FloatingAiCopilot";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Always initialize in dark mode when opened
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  localStorage.setItem('capitalguard_theme', 'dark');
                } catch (e) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-200 relative">
        <ThemeProvider>
          <AuthProvider>
            <PortfolioProvider>
              <SidebarProvider>
                {children}
                <FloatingAiCopilot />
              </SidebarProvider>
            </PortfolioProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
