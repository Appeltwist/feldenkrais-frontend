import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EducationShopDetailPage from "@/components/education/EducationShopDetailPage";
import { fetchSiteConfig } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getEducationShopData, getEducationShopProduct } from "@/lib/education-shop";

type ShopDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ShopDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");

  if (siteConfig?.siteSlug !== "feldenkrais-education") {
    return {};
  }

  const product = getEducationShopProduct(locale, slug);
  if (!product) {
    return {};
  }

  return {
    title: `${product.title} | Feldenkrais Education`,
    description: product.excerpt,
    openGraph: product.imageUrl
      ? {
          title: `${product.title} | Feldenkrais Education`,
          description: product.excerpt,
          images: [{ url: product.imageUrl }],
        }
      : undefined,
  };
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");

  if (siteConfig?.siteSlug !== "feldenkrais-education") {
    notFound();
  }

  const product = getEducationShopProduct(locale, slug);
  if (!product) {
    notFound();
  }

  const relatedProducts = getEducationShopData(locale).products
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  return (
    <EducationShopDetailPage
      locale={locale}
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
