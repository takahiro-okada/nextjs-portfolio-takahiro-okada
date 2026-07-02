import type { Metadata } from "next";

const siteConfig = {
  name: "Takahiro Okada",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://takahiro-okada.com",
  description:
    "Full stack developer and web designer based in Christchurch, New Zealand. Currently pursuing a Master's in Applied Computer Science at Lincoln University.",
};

export function createMetadata(
  title: string,
  description?: string,
  image?: string,
  additionalOG?: Record<string, string | number | boolean>,
): Metadata {
  const fullTitle = title.includes("|")
    ? title
    : `${title} | ${siteConfig.name}`;
  const finalDescription = description || siteConfig.description;
  const ogImage = image || "/og-image.jpg"; // デフォルト OG 画像

  return {
    title: fullTitle,
    description: finalDescription,
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      type: "website",
      locale: "en_US",
      url: siteConfig.baseUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage.startsWith("http")
            ? ogImage
            : `${siteConfig.baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...additionalOG,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: finalDescription,
      images: [
        ogImage.startsWith("http")
          ? ogImage
          : `${siteConfig.baseUrl}${ogImage}`,
      ],
    },
  };
}

// ページタイプ別のメタデータ生成
export function createPageMetadata(
  page: "activity" | "home" | "notes" | "travel" | "works",
) {
  const configs = {
    activity: {
      title: "Activity | Takahiro Okada",
      description:
        "Activity log for Takahiro Okada across GitHub, note, okalog, and YouTube.",
    },
    home: {
      title: "Takahiro Okada | Full Stack Developer & Web Designer",
      description:
        "Full stack developer and web designer based in Christchurch, New Zealand. Currently pursuing a Master's in Applied Computer Science at Lincoln University. Specializing in Next.js, React, and modern web technologies.",
    },
    notes: {
      title: "Notes | Takahiro Okada",
      description:
        "Articles about web development, Next.js, TypeScript, and modern technologies. Technical insights and best practices for building web applications.",
    },
    travel: {
      title: "Travel | Takahiro Okada",
      description:
        "Travel logs from places Takahiro Okada has visited, organized by date, location, and photos.",
    },
    works: {
      title: "Works | Takahiro Okada",
      description:
        "Portfolio of web development and design projects. Featuring work in Next.js, React, Shopify, and modern web technologies.",
    },
  };

  const config = configs[page];
  return createMetadata(config.title, config.description);
}

// 記事ページ用メタデータ生成
export function createArticleMetadata(
  title: string,
  description: string,
  image?: string,
  publishedAt?: string,
  type: "article" | "project" = "article",
) {
  const additionalOG = {
    type,
    ...(publishedAt && { publishedTime: publishedAt }),
  };

  return createMetadata(
    `${title} | ${siteConfig.name}`,
    description,
    image,
    additionalOG,
  );
}
