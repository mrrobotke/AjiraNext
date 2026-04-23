import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/design-system/atoms/ThemeProvider";
import { ThemeBootstrapScript } from "@/design-system/atoms/ThemeBootstrapScript";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Ajira Next",
    template: "%s | Ajira Next",
  },
  description: "The elite career platform for Africa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeBootstrapScript />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
