import { siteConfig as defaultSiteConfig, type SiteConfig } from "../config/site";

export const DEFAULT_OG_IMAGE = "/og-default.png";

export interface HeadInput {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export interface HeadData {
  title: string;
  description: string;
  canonical: string;
  og: {
    type: "website";
    locale: "pt_BR";
    siteName: string;
    title: string;
    description: string;
    url: string;
    image: string;
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    image: string;
  };
}

function absoluteUrl(pathOrUrl: string, origin: string): string {
  return new URL(pathOrUrl, origin).href;
}

export function buildHead(
  { title, description, path, image }: HeadInput,
  config: SiteConfig = defaultSiteConfig,
): HeadData {
  const fullTitle = `${title} | ${config.name}`;
  const canonical = absoluteUrl(path, config.site);
  const imageUrl = absoluteUrl(image ?? DEFAULT_OG_IMAGE, config.site);

  return {
    title: fullTitle,
    description,
    canonical,
    og: {
      type: "website",
      locale: "pt_BR",
      siteName: config.name,
      title: fullTitle,
      description,
      url: canonical,
      image: imageUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      image: imageUrl,
    },
  };
}

const schemaDays: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

export function buildLocalBusinessJsonLd(config: SiteConfig = defaultSiteConfig) {
  const store = config.locations.store;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.name,
    url: config.site,
    email: config.email,
    telephone: config.landline.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.street,
      addressLocality: store.city,
      addressRegion: store.state,
      postalCode: store.postalCode,
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: store.coordinates.lat,
      longitude: store.coordinates.lng,
    },
    hasMap: store.mapsUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: config.openingHours.days.map((day) => schemaDays[day] ?? day),
        opens: config.openingHours.opens,
        closes: config.openingHours.closes,
      },
    ],
    sameAs: [config.instagram.url],
  };
}
