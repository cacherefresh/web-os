export const siteConfig = {
  name: "web-os",
  tagline: "A phone-sized operating system, orbiting nine screens around you.",

  heroTitle: "web-os",
  heroTagline: "Move through the grid. Every screen opens somewhere real.",

  domain: "cacherefresh.io",

  about:
    "web-os is the home screen for a small constellation of independent apps, " +
    "each living in its own repo and deployed to its own subdomain. This screen " +
    "never contains their code — it only points at them.",

  nav: [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
  ],

  metaTitle: "web-os",
  metaDescription: "A phone-sized, futuristic web operating system — nine app screens orbiting a center figure.",
} as const;
