import { siteConfig } from "@/lib/site";
import { services } from "@/lib/data";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Primary organization + local security business schema for Accra search.
 */
export function OrganizationJsonLd() {
  const socialProfiles = Object.values(siteConfig.social).filter(
    (url) => typeof url === "string" && url.startsWith("http"),
  );

  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo/mj-mark.png`,
    image: `${siteConfig.url}/images/og/default.jpg`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    slogan: siteConfig.tagline,
    foundingLocation: {
      "@type": "Place",
      name: "Accra, Ghana",
    },
    areaServed: [
      { "@type": "City", name: "Accra" },
      { "@type": "AdministrativeArea", name: "Greater Accra" },
      { "@type": "Country", name: "Ghana" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: "GH",
    },
    geo: {
      "@type": "GeoCoordinates",
      // Approximate Spintex corridor — refine when exact coords are confirmed.
      latitude: 5.637,
      longitude: -0.092,
    },
    sameAs: socialProfiles,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "16:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        contactType: "sales",
        areaServed: "GH",
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phoneAlt,
        contactType: "customer support",
        areaServed: "GH",
        availableLanguage: ["English"],
      },
    ],
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      url: `${siteConfig.url}/services#${service.slug}`,
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.shortDescription,
        provider: { "@id": `${siteConfig.url}/#organization` },
        areaServed: "Accra",
      },
    })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en-GH",
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
    </>
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteConfig.url}${item.url}`,
    })),
  };

  return <JsonLd data={jsonLd} />;
}

/** Service catalog schema for the services page. */
export function ServicesJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Brite MJ Technologies Security Services",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteConfig.url}/services#${service.slug}`,
      name: service.name,
      description: service.shortDescription,
    })),
  };

  return <JsonLd data={jsonLd} />;
}

/** FAQ schema helper for conversion-focused pages. */
export function FaqJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={jsonLd} />;
}
