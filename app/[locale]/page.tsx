import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";
import { useTranslations } from 'next-intl';

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";

// Components for the features section
const FeatureCard = ({ 
  title: featureTitle, 
  description: featureDescription 
}: { 
  title: string; 
  description: string 
}) => (
  <Card className="border-none shadow-md">
    <CardBody className="p-5">
      <h3 className="text-lg font-semibold text-primary mb-2">{featureTitle}</h3>
      <p className="text-default-500">{featureDescription}</p>
    </CardBody>
  </Card>
);

// Components for the grade levels section
const GradeLevelCard = ({ 
  title: levelTitle, 
  description: levelDescription 
}: { 
  title: string; 
  description: string 
}) => (
  <Card className="border border-divider bg-content1 shadow-sm">
    <CardBody className="p-5">
      <h4 className="text-lg font-semibold mb-2">{levelTitle}</h4>
      <p className="text-sm text-default-500">{levelDescription}</p>
    </CardBody>
  </Card>
);

export default function Home({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations();
  
  // Features data from translations
  const features = [
    {
      key: 'englishImmersion',
      title: t('home.features.items.englishImmersion.title'),
      description: t('home.features.items.englishImmersion.description')
    },
    {
      key: 'leadership',
      title: t('home.features.items.leadership.title'),
      description: t('home.features.items.leadership.description')
    },
    {
      key: 'smallClasses',
      title: t('home.features.items.smallClasses.title'),
      description: t('home.features.items.smallClasses.description')
    },
    {
      key: 'stem',
      title: t('home.features.items.stem.title'),
      description: t('home.features.items.stem.description')
    },
    {
      key: 'creativity',
      title: t('home.features.items.creativity.title'),
      description: t('home.features.items.creativity.description')
    },
    {
      key: 'community',
      title: t('home.features.items.community.title'),
      description: t('home.features.items.community.description')
    }
  ];
  
  // Grade levels data from translations
  const gradeLevels = [
    {
      key: 'preschool',
      title: t('home.education.levels.preschool.title'),
      description: t('home.education.levels.preschool.description')
    },
    {
      key: 'kindergarten',
      title: t('home.education.levels.kindergarten.title'),
      description: t('home.education.levels.kindergarten.description')
    },
    {
      key: 'elementary',
      title: t('home.education.levels.elementary.title'),
      description: t('home.education.levels.elementary.description')
    },
    {
      key: 'middle',
      title: t('home.education.levels.middle.title'),
      description: t('home.education.levels.middle.description')
    },
    {
      key: 'high',
      title: t('home.education.levels.high.title'),
      description: t('home.education.levels.high.description')
    }
  ];

  return (
    <div className="flex flex-col gap-16 py-8 md:py-10">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex-1 space-y-6">
          <div>
            <h1 className={title({ class: "tracking-tight" })}>
              {t('home.hero.title')}
            </h1>
            <h2 className={subtitle({ class: "mt-4" })}>
              {t('home.hero.subtitle')}
            </h2>
          </div>
          <p className="text-default-500 text-lg max-w-3xl">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-wrap gap-4">
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
              href="#learn-more"
              className={buttonStyles({
                variant: "bordered",
                radius: "full",
                size: "lg",
              })}
            >
              {t('buttons.learnMore')}
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
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2670&auto=format&fit=crop"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="learn-more" className="space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('home.features.title')}</h2>
          <p className="text-default-500 mt-2 max-w-2xl mx-auto">
            {t('home.features.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {features.map(feature => (
            <FeatureCard 
              key={feature.key}
              title={feature.title} 
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* Admissions Section */}
      <section className="bg-primary/10 p-8 rounded-2xl space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('home.admissions.title')}</h2>
          <p className="text-default-600 mt-2 text-lg font-medium">
            {t('home.admissions.description')}
          </p>
        </div>
        <div className="flex justify-center mt-4">
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
        </div>
      </section>

      {/* Grade Levels Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('home.education.title')}</h2>
          <p className="text-default-500 mt-2 max-w-2xl mx-auto">
            {t('home.education.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {gradeLevels.map(level => (
            <GradeLevelCard 
              key={level.key}
              title={level.title} 
              description={level.description}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary p-10 rounded-2xl text-white text-center space-y-6">
        <h2 className="text-3xl font-bold">{t('home.cta.title')}</h2>
        <p className="text-lg max-w-2xl mx-auto">
          {t('home.cta.description')}
        </p>
        <p className="font-semibold">{t('home.cta.note')}</p>
        <div className="flex justify-center mt-4">
          <Button
            as={NextLink}
            href={`/${locale}${siteConfig.links.apply}`}
            className={buttonStyles({
              color: "default",
              radius: "full",
              variant: "solid",
              size: "lg",
            })}
          >
            {t('buttons.applyNow')}
          </Button>
        </div>
      </section>
    </div>
  );
}
