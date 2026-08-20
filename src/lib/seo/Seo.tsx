import { Helmet } from "react-helmet-async";
import { getSiteUrl } from "@/lib/tmdb/config";

export interface SeoProps {
  title: string;
  description: string;

  canonicalPath: string;
  image?: string | null;
  imageAlt?: string;

  type?: string;

  noindex?: boolean;

  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  children?: React.ReactNode;
}

const SITE_NAME = "React Movies";

export function Seo({
  title,
  description,
  canonicalPath,
  image,
  imageAlt,
  type = "website",
  noindex = false,
  jsonLd,
  children,
}: SeoProps) {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}${canonicalPath}`;
  const fullTitle =
    title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}
      />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {image ? <meta property="og:image" content={image} /> : null}
      {image ? (
        <meta property="og:image:alt" content={imageAlt ?? title} />
      ) : null}

      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image ? <meta name="twitter:image" content={image} /> : null}

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      {children}
    </Helmet>
  );
}
