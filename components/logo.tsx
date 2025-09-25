import Image from "next/image";
import NextLink from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  locale?: string;
}

export const Logo = ({
  size = "md",
  showText = true,
  locale = "",
}: LogoProps) => {
  // Define size dimensions
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 64, height: 64 },
  };

  return (
    <div className="flex items-center gap-2">
      <NextLink href={`/${locale}`} className="flex items-center gap-2">
        <div className="relative">
          <Image
            src="/images/yals-logo.webp"
            alt="YALS Logo"
            width={sizes[size].width}
            height={sizes[size].height}
            className="object-contain"
            priority
          />
        </div>
        {showText && (
          <div className="flex flex-col">
            <p className="font-bold text-inherit text-sm md:text-base">
              Young African Leaders School
            </p>
            <p className="text-xs text-default-500 hidden md:block">
              Shaping Tomorrow's Leaders
            </p>
          </div>
        )}
      </NextLink>
    </div>
  );
};
