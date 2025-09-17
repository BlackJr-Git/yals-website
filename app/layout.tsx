import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { BasicNavbar } from "@/components/basic-navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <BasicNavbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
            <footer className="w-full py-12 border-t border-divider">
              <div className="container mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* School Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xl text-primary">
                        YALS
                      </span>
                      <span className="text-default-600 text-sm">
                        Young African Leaders School
                      </span>
                    </div>
                    <p className="text-default-500 text-sm">
                      Founded in 2017 in Kinshasa, Young African Leaders School
                      is a premium, English-speaking international school
                      dedicated to shaping Africa's next generation of leaders.
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      {siteConfig.navItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-default-500 hover:text-primary transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                    <ul className="space-y-2 text-default-500">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">📍</span>
                        <span>{siteConfig.links.address}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary">📞</span>
                        <Link
                          href={`tel:${siteConfig.links.phone}`}
                          className="hover:text-primary transition-colors"
                        >
                          {siteConfig.links.phone}
                        </Link>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary">✉️</span>
                        <Link
                          href={`mailto:${siteConfig.links.email}`}
                          className="hover:text-primary transition-colors"
                        >
                          {siteConfig.links.email}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Language & Apply */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-4">Apply Now</h3>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={siteConfig.links.apply}
                        className={buttonStyles({
                          color: "primary",
                          radius: "full",
                          variant: "shadow",
                        })}
                      >
                        Apply Now
                      </Link>
                      <div className="flex items-center gap-2 mt-4">
                        {siteConfig.languages.map((lang) => (
                          <Link
                            key={lang.code}
                            href={lang.href}
                            className="text-default-500 hover:text-primary transition-colors"
                          >
                            {lang.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-divider flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-default-400 text-sm">
                    © {new Date().getFullYear()} Young African Leaders School.
                    All rights reserved.
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href="/privacy"
                      className="text-default-500 text-sm hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/terms"
                      className="text-default-500 text-sm hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </div>
                  <div className="text-default-400 text-xs">
                    <Link
                      href="https://quantumvertex.cd"
                      isExternal
                      className="hover:text-primary transition-colors"
                    >
                      Powered by Quantum Vertex
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
