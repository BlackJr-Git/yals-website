"use client"
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Link } from "@heroui/link";
import { link as linkStyles, button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

import { Logo } from "@/components/logo";

export const Navbar = ({ locale }: { locale: string }) => {
  const t = useTranslations();
  const pathname = usePathname();
  
  // Function to get the path in another locale
  const getLocalizedPath = (targetLocale: string) => {
    // Remove the current locale from the path
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    // Return the path with the new locale
    return `/${targetLocale}${pathWithoutLocale || '/'}`;
  };
  
  // Get the current language object
  const currentLanguage = siteConfig.languages.find(lang => lang.code === locale) || siteConfig.languages[0];
  return (
    <HeroUINavbar 
      maxWidth="xl" 
      position="sticky" 
      className="bg-background/70 backdrop-blur-md border-b border-divider"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Logo locale={locale} showText={true} size="md" />
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium hover:text-primary transition-colors",
                )}
                color="foreground"
                href={`/${locale}${item.href}`}
              >
                {t(`navigation.${item.label.toLowerCase().replace(/\s/g, "")}`)}  
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden md:flex">
          <Button
            as={NextLink}
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={`/${locale}${siteConfig.links.apply}`}
          >
            {t('buttons.applyNow')}
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            as={NextLink}
            className={buttonStyles({
              variant: "bordered",
              radius: "full",
            })}
            href={`/${locale}${siteConfig.links.payment}`}
          >
            {t('buttons.payNow')}
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button 
                variant="light" 
                className="text-sm"
              >
                {currentLanguage.name}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Language options">
              {siteConfig.languages.map((lang) => (
                <DropdownItem 
                  key={lang.code} 
                  href={getLocalizedPath(lang.code)}
                >
                  {lang.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="pt-6">
        <div className="mx-4 mt-2 flex flex-col gap-4">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <NextLink
                className={clsx(
                  linkStyles({ color: index === 0 ? "primary" : "foreground" }),
                  "font-medium text-lg",
                )}
                href={`/${locale}${item.href}`}
              >
                {t(`navigation.${item.label.toLowerCase().replace(/\s/g, "")}`)} 
              </NextLink>
            </NavbarMenuItem>
          ))}
          <div className="flex flex-col gap-2 mt-4">
            <Button
              as={NextLink}
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                size: "lg",
                fullWidth: true,
              })}
              href={`/${locale}${siteConfig.links.apply}`}
            >
              {t('buttons.applyNow')}
            </Button>
            <Button
              as={NextLink}
              className={buttonStyles({
                variant: "bordered",
                radius: "full",
                size: "lg",
                fullWidth: true,
              })}
              href={`/${locale}${siteConfig.links.payment}`}
            >
              {t('buttons.payNow')}
            </Button>
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

