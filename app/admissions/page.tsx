import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";

export default function AdmissionsPageSimple() {
  return (
    <div className="flex flex-col gap-16 py-8 md:py-10">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="tracking-tight inline font-semibold text-[2.3rem] lg:text-5xl">Admissions</h1>
          <p className="w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-3xl">
            Join our vibrant community of future leaders at Young African Leaders School
          </p>
          <p className="text-default-500 text-lg">
            We welcome applications from families who share our vision of academic excellence, leadership development, and global awareness.
            Our admissions process is designed to identify students who will thrive in our challenging and supportive environment.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              as={NextLink}
              href="/admissions/apply"
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                size: "lg",
              })}
            >
              Apply Now
            </Button>
            <Button
              as={NextLink}
              href="#admissions-process"
              className={buttonStyles({
                variant: "bordered",
                radius: "full",
                size: "lg",
              })}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <Image
            isBlurred
            width={600}
            height={400}
            alt="YALS Students"
            className="object-cover rounded-xl shadow-lg"
            src="/images/hero_yals_1.webp"
          />
        </div>
      </section>

      {/* Admissions Process Section */}
      <section id="admissions-process" className="space-y-6">
        <div className="text-center">
          <h2 className="tracking-tight inline font-semibold text-3xl lg:text-4xl">Admissions Process</h2>
          <p className="text-default-500 mt-2 max-w-2xl mx-auto">
            Our admissions process is designed to be clear and straightforward, guiding you from your initial application to a successful enrollment.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6">
        <h2 className="tracking-tight inline font-semibold text-3xl lg:text-4xl">Ready to Apply?</h2>
        <p className="text-default-600 max-w-2xl mx-auto">
          Take the first step towards providing your child with an exceptional education that develops leadership, character, and academic excellence.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button
            as={NextLink}
            href="/admissions/apply"
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
          >
            Start Your Application
          </Button>
          <Button
            as={NextLink}
            href="/contact"
            className={buttonStyles({
              variant: "bordered",
              radius: "full",
              size: "lg",
            })}
          >
            Contact Admissions
          </Button>
        </div>
      </section>
    </div>
  );
}
