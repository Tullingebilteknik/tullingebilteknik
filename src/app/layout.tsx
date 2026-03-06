import type { Metadata } from "next";
import { Rajdhani, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const interTight = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Tullinge Bilteknik - Din bilverkstad i Tullinge",
    template: "%s | Tullinge Bilteknik",
  },
  description:
    "Professionell bilverkstad i Tullinge. Vi erbjuder service, reparation, däckbyte, besiktningsförberedelse och mer. Boka tid idag!",
  keywords: [
    "bilverkstad Tullinge",
    "bilverkstad Tumba",
    "bilverkstad Huddinge",
    "bilservice södra Stockholm",
    "bilreparation Tullinge",
    "däckbyte Tullinge",
    "besiktning Tullinge",
  ],
  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: "Tullinge Bilteknik",
    title: "Tullinge Bilteknik - Din bilverkstad i Tullinge",
    description:
      "Professionell bilverkstad i Tullinge. Service, reparation och diagnostik av alla bilmärken.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${rajdhani.variable} ${interTight.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
