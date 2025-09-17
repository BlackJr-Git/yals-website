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
import { usePathname } from 'next/navigation';

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

// Logo component for YALS
const YALSLogo = () => (
  <div className="flex items-center">
    <span className="font-bold text-xl text-primary">YALS</span>
  </div>
);

export const BasicNavbar = () => {
  const pathname = usePathname();
  
  return (
    <HeroUINavbar 
      maxWidth="xl" 
      position="sticky" 
      className="bg-background/70 backdrop-blur-md border-b border-divider"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <YALSLogo />
            <div className="flex flex-col">
              <p className="font-bold text-inherit text-sm md:text-base">Young African Leaders School</p>
              <p className="text-xs text-default-500 hidden md:block">Shaping Africa's Next Generation of Leaders</p>
            </div>
          </NextLink>
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
                href={item.href}
              >
                {item.label}
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
            href={siteConfig.links.apply}
          >
            Apply Now
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            as={NextLink}
            className={buttonStyles({
              variant: "bordered",
              radius: "full",
            })}
            href={siteConfig.links.payment}
          >
            Pay Now
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button 
                variant="light" 
                className="text-sm"
              >
                English
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Language options">
              {siteConfig.languages.map((lang) => (
                <DropdownItem 
                  key={lang.code} 
                  href={lang.href}
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
                href={item.href}
              >
                {item.label}
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
              href={siteConfig.links.apply}
            >
              Apply Now
            </Button>
            <Button
              as={NextLink}
              className={buttonStyles({
                variant: "bordered",
                radius: "full",
                size: "lg",
                fullWidth: true,
              })}
              href={siteConfig.links.payment}
            >
              Pay Now
            </Button>
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
