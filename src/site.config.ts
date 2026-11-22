// One place to edit who I am, where I'm reachable, and the navigation (decision 0006).

export const site = {
  name: "Vatsal Jain",
  title: "Vatsal Jain",
  description:
    "Personal site of Vatsal Jain, an engineering student. Projects, notes and writing.",
  locale: "en",

  github: {
    username: "vatsalpjain",
    // Only public repos with this topic appear on /projects (decision 0003).
    topic: "portfolio",
  },

  links: {
    email: "vatsalpjain@gmail.com",
    github: "https://github.com/vatsalpjain",
    linkedin: "https://www.linkedin.com/in/vatsalpjain",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
  ],

  // How many projects the Home page shows before linking to /projects.
  homeProjectCount: 3,
} as const;

export type NavItem = (typeof site.nav)[number];
