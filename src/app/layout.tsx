import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
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
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
