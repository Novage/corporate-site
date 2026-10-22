// Structured data (schema.org) describing Novage, shared by pages that
// reference the company as author or publisher.
export const siteUrl = "https://novage.com.ua/";

export const organization = {
  "@type": "Organization",
  "@id": `${siteUrl}#organization`,
  name: "Novage",
  legalName: "Novage, LLC",
  url: siteUrl,
  logo: `${siteUrl}images/novage-logo.svg`,
  email: "contact@novage.com.ua",
  description:
    "Software engineering & R&D company taking on the complete development cycle: product design, development, QA, and delivery.",
  founder: {
    "@type": "Person",
    name: "Andriy Lysnevych",
    sameAs: ["https://www.linkedin.com/in/lysnevych/"],
  },
  sameAs: [
    "https://github.com/novage",
    "https://www.linkedin.com/company/novage/",
  ],
};
