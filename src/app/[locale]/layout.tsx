import React, { type ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import {
  JetBrains_Mono,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Poppins
} from "next/font/google";
import { routing, type AppLocale } from "@/i18n/routing";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap"
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600"],
  variable: "--font-playfair",
  display: "swap"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap"
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const validLocale: AppLocale = routing.locales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : "en";
  const t = await getTranslations({
    locale: validLocale,
    namespace: "metadata"
  });
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://publimarca.do";

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${validLocale}`,
      languages: {
        en: "/en",
        es: "/es"
      }
    },
    openGraph: {
      type: "website",
      siteName: "Publimarca Studio",
      title: t("title"),
      description: t("description"),
      locale: validLocale === "es" ? "es_DO" : "en_US",
      alternateLocale: validLocale === "es" ? ["en_US"] : ["es_DO"]
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description")
    }
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`light scroll-smooth ${poppins.variable} ${outfit.variable} ${playfair.variable} ${jakarta.variable} ${mono.variable}`}
    >
      <body className="bg-[#FBFBF9] font-sans text-[#101014] antialiased selection:bg-[#A01318] selection:text-white">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
