export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Young African Leaders School",
  description: "At YALS, we don't just educate — we empower. We prepare students to lead, to dream big, to think critically, and to become global changemakers.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Admissions",
      href: "/admissions",
    },
    {
      label: "Programs",
      href: "/programs",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Admissions",
      href: "/admissions",
    },
    {
      label: "Programs",
      href: "/programs",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  links: {
    apply: "/admissions/apply",
    payment: "/admissions/payment",
    email: "yalsdrc@gmail.com",
    phone: "+243 818 803 273",
    address: "4, Avenue Le Marinel, Kinshasa/Gombe, Democratic Republic of Congo",
  },
  languages: [
    {
      code: "en",
      name: "English (US)",
      href: "/"
    },
    {
      code: "fr",
      name: "Français",
      href: "/fr"
    }
  ]
};
