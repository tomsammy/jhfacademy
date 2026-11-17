import React from "react";
import {
  SITE_CONFIG,
  TRAINING_PROGRAMS,
  LOCAL_FAQS,
  ADDITIONAL_FEES,
} from "@/data/siteData";

export function JsonLdSchema() {
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "LocalBusiness", "ClothingStore"],
        "@id": `${SITE_CONFIG.domain}/#organization`,
        name: SITE_CONFIG.name,
        alternateName: [
          "Julian House of Fashion",
          "JHF Academy Ilorin",
          "Julian House of Fashion Ilorin",
        ],
        url: SITE_CONFIG.domain,
        logo: `${SITE_CONFIG.domain}/icon.svg`,
        image: [
          `${SITE_CONFIG.domain}/images/editorial/director-navy-atelier-seated.jpg`,
          `${SITE_CONFIG.domain}/images/editorial/asoebi-turquoise-beaded-lace.jpg`,
          `${SITE_CONFIG.domain}/images/editorial/director-navy-atelier-standing.jpg`,
          `${SITE_CONFIG.domain}/images/editorial/director-lime-draped-boubou.jpg`,
        ],
        description: SITE_CONFIG.description,
        slogan: SITE_CONFIG.tagline,
        foundingDate: "2018-02-04",
        founder: {
          "@type": "Person",
          name: SITE_CONFIG.founder,
          jobTitle: "Founder & Creative Director",
        },
        telephone: SITE_CONFIG.phoneRaw,
        email: SITE_CONFIG.email,
        priceRange: "₦₦",
        currenciesAccepted: "NGN",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_CONFIG.address.street,
          addressLocality: SITE_CONFIG.address.city,
          addressRegion: SITE_CONFIG.address.state,
          postalCode: SITE_CONFIG.address.postalCode,
          addressCountry: SITE_CONFIG.address.countryCode,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE_CONFIG.geo.latitude,
          longitude: SITE_CONFIG.geo.longitude,
        },
        areaServed: [
          { "@type": "City", name: "Ilorin" },
          { "@type": "State", name: "Kwara State" },
          { "@type": "Country", name: "Nigeria" },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
            opens: "09:00",
            closes: "17:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday"],
            opens: "10:00",
            closes: "16:00",
          },
        ],
        sameAs: [SITE_CONFIG.social.facebook, SITE_CONFIG.social.instagram],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Fashion Training Programmes & Fees",
          itemListElement: TRAINING_PROGRAMS.map((program) => ({
            "@type": "Course",
            name: program.title,
            description: `${program.summary} Registration fee: ${ADDITIONAL_FEES.registrationFormatted} (one-time). Student accommodation available at ${ADDITIONAL_FEES.accommodationFormatted} for ${ADDITIONAL_FEES.accommodationDuration}.`,
            provider: {
              "@id": `${SITE_CONFIG.domain}/#organization`,
            },
            educationalLevel: program.level,
            timeRequired: program.isoDuration,
            offers: {
              "@type": "Offer",
              price: program.priceNaira,
              priceCurrency: "NGN",
              availability: "https://schema.org/InStock",
              url: `${SITE_CONFIG.domain}/academy#${program.slug}`,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.domain}/#website`,
        url: SITE_CONFIG.domain,
        name: SITE_CONFIG.name,
        publisher: {
          "@id": `${SITE_CONFIG.domain}/#organization`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_CONFIG.domain}/#faq`,
        mainEntity: LOCAL_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
}
