import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
