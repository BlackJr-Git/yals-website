import { title, subtitle } from "@/components/primitives";
import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";
import { useTranslations } from 'next-intl';

import { siteConfig } from "@/config/site";

// Components for the team section
const TeamMemberCard = ({ 
  name, 
  role, 
  image, 
  bio 
}: { 
  name: string; 
  role: string; 
  image: string; 
  bio: string 
}) => (
  <Card className="border-none shadow-md">
    <CardBody className="p-0">
      <Image
        isBlurred
        width={400}
        height={300}
        alt={name}
        className="object-cover w-full h-64"
        src={image}
      />
      <div className="p-5 space-y-2">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-primary font-medium">{role}</p>
        <p className="text-default-500 text-sm">{bio}</p>
      </div>
    </CardBody>
  </Card>
);

// Components for the values section
const ValueCard = ({ title: valueTitle, description: valueDescription }: { title: string; description: string }) => (
  <Card className="border border-divider bg-content1">
    <CardBody className="p-5">
      <h3 className="text-lg font-semibold mb-2">{valueTitle}</h3>
      <p className="text-default-500 text-sm">{valueDescription}</p>
    </CardBody>
  </Card>
);

export default function AboutPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations();
  
  // Values data from translations
  const values = [
    {
      key: 'excellence',
      title: t('about.values.items.excellence.title'),
      description: t('about.values.items.excellence.description')
    },
    {
      key: 'leadership',
      title: t('about.values.items.leadership.title'),
      description: t('about.values.items.leadership.description')
    },
    {
      key: 'global',
      title: t('about.values.items.global.title'),
      description: t('about.values.items.global.description')
    },
    {
      key: 'character',
      title: t('about.values.items.character.title'),
      description: t('about.values.items.character.description')
    },
    {
      key: 'innovation',
      title: t('about.values.items.innovation.title'),
      description: t('about.values.items.innovation.description')
    },
    {
      key: 'community',
      title: t('about.values.items.community.title'),
      description: t('about.values.items.community.description')
    }
  ];
  
  // Team members data
  const teamMembers = [
    {
      name: "Dr. Marie Nkosi",
      role: "School Director",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop",
      bio: "With over 20 years of experience in international education, Dr. Nkosi leads YALS with a passion for developing young leaders and educational excellence."
    },
    {
      name: "Prof. Jean Mutombo",
      role: "Academic Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
      bio: "Professor Mutombo oversees our curriculum development and teaching standards, bringing his expertise in educational psychology and bilingual education."
    },
    {
      name: "Ms. Sarah Okito",
      role: "Student Affairs Coordinator",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2670&auto=format&fit=crop",
      bio: "Ms. Okito manages student support services and extracurricular programs, ensuring a holistic approach to student development and well-being."
    }
  ];
  
  // Facilities list from translations
  const facilities = t('about.facilities.items', { count: 7 }) as string[];

  return (
    <div className="flex flex-col gap-16 py-8 md:py-10">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex-1 space-y-6">
          <h1 className={title()}>{t('about.hero.title')}</h1>
          <p className={subtitle({ class: "max-w-3xl" })}>
            {t('about.hero.subtitle')}
          </p>
          <p className="text-default-500 text-lg">
            {t('about.hero.description')}
          </p>
        </div>
        <div className="flex-1">
          <Image
            isBlurred
            width={600}
            height={400}
            alt="YALS School Building"
            className="object-cover rounded-xl shadow-lg"
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2671&auto=format&fit=crop"
          />
        </div>
      </section>

      {/* Our Story Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('about.story.title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Image
              isBlurred
              width={600}
              height={400}
              alt="YALS History"
              className="object-cover rounded-xl shadow-lg"
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2664&auto=format&fit=crop"
            />
          </div>
          <div className="space-y-4">
            {(t('about.story.content', { count: 3 }) as string[]).map((paragraph, index) => (
              <p key={index} className="text-default-600">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('about.values.title')}</h2>
          <p className="text-default-500 mt-2 max-w-2xl mx-auto">
            {t('about.values.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {values.map(value => (
            <ValueCard 
              key={value.key}
              title={value.title} 
              description={value.description}
            />
          ))}
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="bg-primary/10 p-8 rounded-2xl space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('about.approach.title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t('about.approach.items.english.title')}</h3>
            <p className="text-default-600">
              {t('about.approach.items.english.description')}
            </p>
            
            <h3 className="text-xl font-bold">{t('about.approach.items.smallClasses.title')}</h3>
            <p className="text-default-600">
              {t('about.approach.items.smallClasses.description')}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t('about.approach.items.stem.title')}</h3>
            <p className="text-default-600">
              {t('about.approach.items.stem.description')}
            </p>
            
            <h3 className="text-xl font-bold">{t('about.approach.items.leadership.title')}</h3>
            <p className="text-default-600">
              {t('about.approach.items.leadership.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('about.team.title')}</h2>
          <p className="text-default-500 mt-2 max-w-2xl mx-auto">
            {t('about.team.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard 
              key={index}
              name={member.name} 
              role={member.role}
              image={member.image}
              bio={member.bio}
            />
          ))}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('about.facilities.title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              isBlurred
              width={600}
              height={400}
              alt="YALS Campus"
              className="object-cover rounded-xl shadow-lg"
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop"
            />
          </div>
          <div className="space-y-4">
            <p className="text-default-600">
              {t('about.facilities.description')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-default-600">
              {facilities.map((facility, index) => (
                <li key={index}>{facility}</li>
              ))}
            </ul>
            <p className="text-default-600 mt-4">
              {t('about.facilities.note')}
            </p>
          </div>
        </div>
      </section>

      {/* Accreditation Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('about.accreditation.title')}</h2>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <p className="text-default-600 max-w-3xl">
            {t('about.accreditation.description')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 opacity-70">
            <div className="flex items-center justify-center p-4">
              <div className="w-24 h-24 bg-default-200 rounded-full flex items-center justify-center">
                <span className="font-bold text-default-600">Partner 1</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="w-24 h-24 bg-default-200 rounded-full flex items-center justify-center">
                <span className="font-bold text-default-600">Partner 2</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="w-24 h-24 bg-default-200 rounded-full flex items-center justify-center">
                <span className="font-bold text-default-600">Partner 3</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="w-24 h-24 bg-default-200 rounded-full flex items-center justify-center">
                <span className="font-bold text-default-600">Partner 4</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6">
        <h2 className={title({ size: "sm" })}>{t('about.cta.title')}</h2>
        <p className="text-default-600 max-w-2xl mx-auto">
          {t('about.cta.description')}
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button
            as={NextLink}
            href={`/${locale}${siteConfig.links.apply}`}
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
          >
            {t('buttons.applyNow')}
          </Button>
          <Button
            as={NextLink}
            href={`/${locale}/contact`}
            className={buttonStyles({
              variant: "bordered",
              radius: "full",
              size: "lg",
            })}
          >
            {t('buttons.contactUs')}
          </Button>
        </div>
      </section>
    </div>
  );
}
