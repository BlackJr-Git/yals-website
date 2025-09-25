import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { 
  EnglishIcon, 
  LeadershipIcon, 
  SmallClassesIcon, 
  StemIcon, 
  CreativityIcon, 
  CommunityIcon,
  PhotoIcon,
  IdCardIcon,
  ParentIcon,
  TranscriptIcon
} from "@/components/feature-icons";

// Components for the features section
const FeatureCard = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) => (
  <Card className="border-none shadow-md">
    <CardBody className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
          <Icon className="text-primary-500 w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
      </div>
      <p className="text-default-500">{description}</p>
    </CardBody>
  </Card>
);

// Components for the grade levels section
const GradeLevelCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Card className="border border-divider bg-content1 shadow-sm">
    <CardBody className="p-5">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-sm text-default-500">{description}</p>
    </CardBody>
  </Card>
);

export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-8 md:py-10">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex-1 space-y-6">
          <div>
            <h1 className={title({ class: "tracking-tight" })}>
              Welcome to{" "}
              <span className={title({ color: "violet" })}>
                Young African Leaders School
              </span>
            </h1>
            <h2 className={subtitle({ class: "mt-4" })}>
              Where Confident Leaders Are Made through academic excellence,
              English immersion, and global awareness
            </h2>
          </div>
          <p className="text-default-500 text-lg max-w-3xl">
            At YALS, we don't just educate — we empower. We prepare students to
            lead, to dream big, to think critically, and to become global
            changemakers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              as={NextLink}
              href={siteConfig.links.apply}
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
              href="#learn-more"
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
        <div className="flex-1 relative max-w-[600px] mx-auto md:mx-0">
          {/* Version desktop - Une structure de photos en mosaïque plus fluide */}
          <div className="hidden md:block relative w-full aspect-[4/3] rounded-xl overflow-hidden">
            {/* Image principale (grande) */}
            <div className="absolute left-0 top-0 w-[65%] h-[65%] p-1">
              <Image
                isBlurred
                alt="YALS Students"
                className="object-cover rounded-xl shadow-lg w-full h-full"
                src="/images/hero_yals_1.webp"
                width={600}
                height={400}
                radius="lg"
              />
            </div>
            
            {/* Image en haut à droite */}
            <div className="absolute right-0 top-0 w-[35%] h-[35%] p-1">
              <Image
                isBlurred
                alt="YALS Students"
                className="object-cover rounded-xl shadow-lg w-full h-full"
                src="/images/hero_yals_2.webp"
                width={300}
                height={200}
                radius="lg"
              />
            </div>
            
            {/* Image au milieu à droite */}
            <div className="absolute right-0 top-[35%] w-[35%] h-[30%] p-1">
              <Image
                isBlurred
                alt="YALS Students"
                className="object-cover rounded-xl shadow-lg w-full h-full"
                src="/images/hero_yals_3.webp"
                width={300}
                height={200}
                radius="lg"
              />
            </div>
            
            {/* Image en bas à gauche */}
            <div className="absolute left-0 bottom-0 w-[30%] h-[35%] p-1">
              <Image
                isBlurred
                alt="YALS Students"
                className="object-cover rounded-xl shadow-lg w-full h-full"
                src="/images/hero_yals_4.webp"
                width={300}
                height={200}
                radius="lg"
              />
            </div>
            
            {/* Image en bas au milieu */}
            <div className="absolute left-[30%] bottom-0 w-[35%] h-[35%] p-1">
              <Image
                isBlurred
                alt="YALS Students"
                className="object-cover rounded-xl shadow-lg w-full h-full"
                src="/images/hero_yals_5.webp"
                width={300}
                height={200}
                radius="lg"
              />
            </div>
            
            {/* Espace logo YALS - repositionné plus bas */}
            {/* <div className="absolute right-0 bottom-0 w-[35%] h-[35%] p-1">
              <div className="bg-gradient-to-br from-primary/10 to-primary/30 rounded-xl flex items-center justify-center w-full h-full shadow-lg">
                <span className="font-bold text-2xl text-primary">YALS</span>
              </div>
            </div> */}
            
            {/* Overlay d'effet avec dégradé */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/10 pointer-events-none"></div>
          </div>
          
          {/* Version mobile - Affichage de plusieurs images en grille simple */}
          <div className="md:hidden space-y-2">
            {/* Première rangée - Image principale */}
            <div className="w-full h-[220px] relative rounded-xl overflow-hidden">
              <Image
                isBlurred
                alt="YALS Students"
                className="object-cover w-full h-full"
                src="/images/hero_yals_1.webp"
                width={500}
                height={300}
                radius="lg"
              />
            </div>
            
            {/* Deuxième rangée - Deux images plus petites */}
            <div className="flex gap-2">
              <div className="w-1/2 h-[120px] relative rounded-xl overflow-hidden">
                <Image
                  isBlurred
                  alt="YALS Students"
                  className="object-cover w-full h-full"
                  src="/images/hero_yals_2.webp"
                  width={250}
                  height={150}
                  radius="lg"
                />
              </div>
              <div className="w-1/2 h-[120px] relative rounded-xl overflow-hidden">
                <Image
                  isBlurred
                  alt="YALS Students"
                  className="object-cover w-full h-full"
                  src="/images/hero_yals_3.webp"
                  width={250}
                  height={150}
                  radius="lg"
                />
              </div>
            </div>
            
            {/* Troisième rangée - Deux images et le logo */}
            <div className="flex gap-2">
              <div className="w-1/3 h-[80px] relative rounded-xl overflow-hidden">
                <Image
                  isBlurred
                  alt="YALS Students"
                  className="object-cover w-full h-full"
                  src="/images/hero_yals_4.webp"
                  width={150}
                  height={100}
                  radius="lg"
                />
              </div>
              <div className="w-1/3 h-[80px] relative rounded-xl overflow-hidden">
                <Image
                  isBlurred
                  alt="YALS Students"
                  className="object-cover w-full h-full"
                  src="/images/hero_yals_5.webp"
                  width={150}
                  height={100}
                  radius="lg"
                />
              </div>
              <div className="w-1/3 h-[80px] bg-gradient-to-br from-primary/10 to-primary/30 rounded-xl flex items-center justify-center">
                <span className="font-bold text-base text-primary">YALS</span>
              </div>
            </div>
          </div>
          
          {/* Effet de décoration */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-primary/5 filter blur-3xl pointer-events-none hidden md:block"></div>
          <div className="absolute -top-5 -left-5 w-20 h-20 rounded-full bg-secondary/5 filter blur-xl pointer-events-none hidden md:block"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="learn-more" className="space-y-12 mt-24">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>Why Choose YALS?</h2>
          <p className="text-default-500 mt-2 max-w-2xl mx-auto">
            Discover what makes YALS unique and how we create an exceptional
            learning experience for every student.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <FeatureCard
            icon={EnglishIcon}
            title="Full English Immersion"
            description="100% English-speaking environment that prepares students for global opportunities."
          />
          <FeatureCard
            icon={LeadershipIcon}
            title="Leadership & Global Mindset"
            description="Developing tomorrow's leaders with skills to thrive in an interconnected world."
          />
          <FeatureCard
            icon={SmallClassesIcon}
            title="Small Classes, Big Dreams"
            description="Personalized attention for every student to ensure academic excellence."
          />
          <FeatureCard
            icon={StemIcon}
            title="STEM Focus"
            description="Strong emphasis on Science, Technology, Engineering & Math to prepare for future careers."
          />
          <FeatureCard
            icon={CreativityIcon}
            title="Creativity & Critical Thinking"
            description="Encouraging innovative problem-solving and independent thought."
          />
          <FeatureCard
            icon={CommunityIcon}
            title="Community Engagement"
            description="Building responsible global citizens through service and community projects."
          />
        </div>
      </section>

      {/* Admissions Section */}
      <section className="bg-primary/10 p-8 rounded-2xl space-y-6 mt-24">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>🚀 Admissions Now Open</h2>
          <p className="text-default-600 mt-2 text-lg font-medium">
            Limited seats available! Give your child the advantage of English,
            leadership, and academic excellence.
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            as={NextLink}
            href={siteConfig.links.apply}
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
          >
            Apply Now
          </Button>
        </div>
      </section>

      {/* Grade Levels Section */}
      <section className="space-y-6 mt-24">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>Our Educational Journey</h2>
          <p className="text-default-500 mt-2 max-w-2xl mx-auto">
            YALS proudly serves students across multiple educational levels,
            welcoming children from diverse backgrounds who are eager to grow,
            learn and lead.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <GradeLevelCard
            title="Preschool"
            description="A nurturing space focused on early childhood development, language exposure, and social skills through hands-on, exploratory learning."
          />
          <GradeLevelCard
            title="Kindergarten"
            description="A dynamic and structured learning environment where students build social skills, language development, and early academic foundations."
          />
          <GradeLevelCard
            title="Elementary School (Grade 1-5)"
            description="A vibrant, skill-building phase where students strengthen their academic abilities and develop independent thinking."
          />
          <GradeLevelCard
            title="Middle School (Grade 6-8)"
            description="A critical growth stage where students deepen their knowledge and engage in leadership opportunities."
          />
          <GradeLevelCard
            title="High School (Grade 9-12)"
            description="A preparation-focused stage that equips students for higher education, entrepreneurship, and leadership in their communities."
          />
        </div>
      </section>

      {/* How to Apply Section */}
      <section className="mt-24 relative">
        {/* Decorative elements */}
        <div className="absolute left-0 top-10 opacity-20">
          <div className="grid grid-cols-3 gap-1">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
        </div>
        <div className="absolute right-0 bottom-10">
          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rotate-45 rounded-xl"></div>
        </div>
        
        {/* Main content */}
        <div className="text-center mb-12">
          <h2 className={title({ size: "sm" })}>How to Apply</h2>
          <p className="text-default-500 mt-2 max-w-2xl mx-auto">
            Discover the simple steps to begin your journey with us. Our admissions process is designed 
            to be clear and straightforward, guiding you from your initial application to a successful 
            enrollment. Follow the instructions below to secure your place at our school.
          </p>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Roadmap line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 -translate-x-1/2 z-0"></div>
          
          {/* Step 1 */}
          <div className="relative mb-24">
            <div className="absolute left-1/2 top-0 w-8 h-8 rounded-full bg-primary -translate-x-1/2 z-10 flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16">
              <div className="text-right md:pr-12">
                <h3 className="text-xl font-bold mb-3">Complete the Application Form</h3>
                <p className="text-default-600">
                  Register your children online by filling in the form. Provide accurate information about your child and family.
                </p>
              </div>
              <div className="md:pl-12 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 relative">
                  <div className="absolute -top-6 -left-6 w-12 h-20 border-l-4 border-b-4 border-primary rotate-12"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative mb-24">
            <div className="absolute left-1/2 top-0 w-8 h-8 rounded-full bg-primary -translate-x-1/2 z-10 flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16">
              <div className="md:order-2 text-left md:pl-12">
                <h3 className="text-xl font-bold mb-3">Submit Documents</h3>
                <p className="text-default-600">
                  Upload or submit required documents including photos, IDs, transcripts, and other necessary paperwork.
                </p>
              </div>
              <div className="md:order-1 md:pr-12 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-1">
                  <div className="w-5 h-5 bg-primary/10"></div>
                  <div className="w-5 h-5 bg-primary/20"></div>
                  <div className="w-5 h-5 bg-primary/30"></div>
                  <div className="w-5 h-5 bg-primary/40"></div>
                  <div className="w-5 h-5 bg-primary/20"></div>
                  <div className="w-5 h-5 bg-primary/30"></div>
                  <div className="w-5 h-5 bg-primary/40"></div>
                  <div className="w-5 h-5 bg-primary/50"></div>
                  <div className="w-5 h-5 bg-primary/30"></div>
                  <div className="w-5 h-5 bg-primary/40"></div>
                  <div className="w-5 h-5 bg-primary/50"></div>
                  <div className="w-5 h-5 bg-primary/60"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 w-8 h-8 rounded-full bg-primary -translate-x-1/2 z-10 flex items-center justify-center text-white font-bold">
              3
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16">
              <div className="text-right md:pr-12">
                <h3 className="text-xl font-bold mb-3">Confirm Your Enrollment</h3>
                <p className="text-default-600">
                  Upon acceptance, secure your child's place by paying the enrollment fee and completing the registration process.
                </p>
              </div>
              <div className="md:pl-12 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button
            as={NextLink}
            href={siteConfig.links.apply}
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
          >
            Start Your Application
          </Button>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="mt-24 relative">
        {/* Decorative elements */}
        <div className="absolute -left-20 bottom-0 opacity-20 hidden lg:block">
          <div className="w-40 h-40 bg-primary/10 rotate-45"></div>
        </div>
        <div className="absolute -right-20 top-0 opacity-20 hidden lg:block">
          <div className="w-40 h-20 bg-primary/10 rotate-12"></div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-8">
            <h2 className={title({ size: "sm" })}>Required Documents</h2>
            <p className="text-default-500 mt-2 max-w-3xl">
              To ensure a smooth and complete enrollment process, we kindly ask all applicants to 
              prepare the following documents. These requirements help us verify identities, assess 
              academic backgrounds, and create a secure, supportive environment for every student.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Document Item 1 */}
              <div className="flex gap-4 p-4 bg-default-50 rounded-lg">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PhotoIcon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Two recent passport-sized photographs</h3>
                  <p className="text-default-500 text-sm">Two recent passport-sized photos of the student, taken on a light background.</p>
                  <p className="text-xs text-default-400 mt-1">These will be used for administrative records and the student ID card.</p>
                </div>
              </div>
              
              {/* Document Item 2 */}
              <div className="flex gap-4 p-4 bg-default-50 rounded-lg">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IdCardIcon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Copy of student's identification</h3>
                  <p className="text-default-500 text-sm">A copy of a valid identification document for the student (passport, national ID, or birth certificate).</p>
                  <p className="text-xs text-default-400 mt-1">This ensures the accuracy of personal details and verifies the student's identity.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Document Item 3 */}
              <div className="flex gap-4 p-4 bg-default-50 rounded-lg">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ParentIcon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Copy of parent/guardian identification</h3>
                  <p className="text-default-500 text-sm">A copy of the parent or legal guardian's identification.</p>
                  <p className="text-xs text-default-400 mt-1">This is essential to formalize enrollment and confirm legal responsibility.</p>
                </div>
              </div>
              
              {/* Document Item 4 */}
              <div className="flex gap-4 p-4 bg-default-50 rounded-lg">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TranscriptIcon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Previous school reports/transcripts</h3>
                  <p className="text-default-500 text-sm">Copies of the student's previous school reports or transcripts (if applicable).</p>
                  <p className="text-xs text-default-400 mt-1">These documents help us understand the student's academic background and place them in the most suitable class or program.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-lg">
            <p className="text-sm text-default-600">
              <span className="font-semibold">Note:</span> All documents must be submitted in either English or French. Any documents in other languages must be accompanied by a certified translation. Digital copies are acceptable for the initial application, but original documents may be requested for verification during the enrollment process.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary p-10 rounded-2xl text-white text-center space-y-6 mt-24">
        <h2 className="text-3xl font-bold">Ready to Join YALS?</h2>
        <p className="text-lg max-w-2xl mx-auto">
          Your child's future starts here. Prepare them for success in an
          international, English-speaking school that builds confident, capable
          leaders.
        </p>
        <p className="font-semibold">Limited seats available!</p>
        <div className="flex justify-center mt-4">
          <Button
            as={NextLink}
            href={siteConfig.links.apply}
            className={buttonStyles({
              color: "default",
              radius: "full",
              variant: "solid",
              size: "lg",
            })}
          >
            Apply Now
          </Button>
        </div>
      </section>
    </div>
  );
}
