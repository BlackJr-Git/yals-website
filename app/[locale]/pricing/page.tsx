import { title, subtitle } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";
import { useTranslations } from 'next-intl';

import { siteConfig } from "@/config/site";

// Components for the pricing page
const PricingCard = ({
  title,
  description,
  price,
  period,
  features,
  isPopular,
}: {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}) => (
  <Card className={`border ${isPopular ? 'border-primary shadow-lg' : 'border-divider'}`}>
    {isPopular && (
      <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
        Most Popular
      </div>
    )}
    <CardHeader className="flex flex-col gap-1 pb-0">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-default-500 text-sm">{description}</p>
    </CardHeader>
    <CardBody className="py-4">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-default-500 text-sm">{period}</span>
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-primary text-lg">✓</span>
            <span className="text-default-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </CardBody>
    <CardFooter>
      <Button
        as={NextLink}
        href={siteConfig.links.apply}
        className={buttonStyles({
          color: isPopular ? "primary" : "default",
          radius: "full",
          variant: isPopular ? "shadow" : "bordered",
          fullWidth: true,
        })}
      >
        Apply Now
      </Button>
    </CardFooter>
  </Card>
);

export default function PricingPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations();
  
  // Get pricing data from translations
  const preschoolFeatures = t('pricing.levels.preschool.features', { count: 5 }) as string[];
  const elementaryFeatures = t('pricing.levels.elementary.features', { count: 5 }) as string[];
  const secondaryFeatures = t('pricing.levels.secondary.features', { count: 5 }) as string[];

  return (
    <div className="flex flex-col gap-16 py-8 md:py-10">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className={title()}>{t('pricing.hero.title')}</h1>
        <p className={subtitle({ class: "max-w-3xl mx-auto" })}>
          {t('pricing.hero.description')}
        </p>
      </section>

      {/* Pricing Tabs */}
      <section>
        <Tabs aria-label="School levels" className="justify-center">
          <Tab key="all" title={t('pricing.levels.all')}>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <PricingCard
                title={t('pricing.levels.preschool.title')}
                description={t('pricing.levels.preschool.description')}
                price={t('pricing.levels.preschool.price')}
                period={t('pricing.levels.preschool.period')}
                features={preschoolFeatures}
              />
              <PricingCard
                title={t('pricing.levels.elementary.title')}
                description={t('pricing.levels.elementary.description')}
                price={t('pricing.levels.elementary.price')}
                period={t('pricing.levels.elementary.period')}
                features={elementaryFeatures}
                isPopular
              />
              <PricingCard
                title={t('pricing.levels.secondary.title')}
                description={t('pricing.levels.secondary.description')}
                price={t('pricing.levels.secondary.price')}
                period={t('pricing.levels.secondary.period')}
                features={secondaryFeatures}
              />
            </div>
          </Tab>
          <Tab key="preschool" title={t('pricing.levels.preschool.title')}>
            <div className="mt-8 max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <h3 className="text-2xl font-bold">{t('pricing.levels.preschool.programTitle')}</h3>
                  <p className="text-default-500">{t('pricing.levels.preschool.description')}</p>
                </CardHeader>
                <Divider/>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-primary mb-2">Program Overview</h4>
                      <p className="text-default-600">
                        {t('pricing.levels.preschool.overview')}
                      </p>
                    </div>
                    
                    <Table aria-label="Preschool & Kindergarten Fees">
                      <TableHeader>
                        <TableColumn>{t('pricing.fees.title')}</TableColumn>
                        <TableColumn>{t('pricing.fees.amount')}</TableColumn>
                        <TableColumn>{t('pricing.fees.details')}</TableColumn>
                      </TableHeader>
                      <TableBody>
                        <TableRow key="tuition">
                          <TableCell>{t('pricing.fees.tuition')}</TableCell>
                          <TableCell>{t('pricing.levels.preschool.price')}</TableCell>
                          <TableCell>{t('pricing.fees.installments')}</TableCell>
                        </TableRow>
                        <TableRow key="registration">
                          <TableCell>{t('pricing.fees.registration')}</TableCell>
                          <TableCell>$200</TableCell>
                          <TableCell>{t('pricing.fees.nonRefundable')}</TableCell>
                        </TableRow>
                        <TableRow key="materials">
                          <TableCell>{t('pricing.fees.materials')}</TableCell>
                          <TableCell>$150</TableCell>
                          <TableCell>{t('pricing.fees.annual')}</TableCell>
                        </TableRow>
                        <TableRow key="meals">
                          <TableCell>{t('pricing.fees.meals')}</TableCell>
                          <TableCell>$300</TableCell>
                          <TableCell>{t('pricing.fees.optional')}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardBody>
                <Divider/>
                <CardFooter>
                  <Button
                    as={NextLink}
                    href={`/${locale}${siteConfig.links.apply}`}
                    className={buttonStyles({
                      color: "primary",
                      radius: "full",
                    })}
                  >
                    {t('buttons.applyNow')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </Tab>
          <Tab key="elementary" title={t('pricing.levels.elementary.title')}>
            <div className="mt-8 max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <h3 className="text-2xl font-bold">{t('pricing.levels.elementary.programTitle')}</h3>
                  <p className="text-default-500">{t('pricing.levels.elementary.description')}</p>
                </CardHeader>
                <Divider/>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-primary mb-2">Program Overview</h4>
                      <p className="text-default-600">
                        {t('pricing.levels.elementary.overview')}
                      </p>
                    </div>
                    
                    <Table aria-label="Elementary School Fees">
                      <TableHeader>
                        <TableColumn>{t('pricing.fees.title')}</TableColumn>
                        <TableColumn>{t('pricing.fees.amount')}</TableColumn>
                        <TableColumn>{t('pricing.fees.details')}</TableColumn>
                      </TableHeader>
                      <TableBody>
                        <TableRow key="tuition">
                          <TableCell>{t('pricing.fees.tuition')}</TableCell>
                          <TableCell>{t('pricing.levels.elementary.price')}</TableCell>
                          <TableCell>{t('pricing.fees.installments')}</TableCell>
                        </TableRow>
                        <TableRow key="registration">
                          <TableCell>{t('pricing.fees.registration')}</TableCell>
                          <TableCell>$250</TableCell>
                          <TableCell>{t('pricing.fees.nonRefundable')}</TableCell>
                        </TableRow>
                        <TableRow key="materials">
                          <TableCell>{t('pricing.fees.books')}</TableCell>
                          <TableCell>$200</TableCell>
                          <TableCell>{t('pricing.fees.annual')}</TableCell>
                        </TableRow>
                        <TableRow key="technology">
                          <TableCell>{t('pricing.fees.technology')}</TableCell>
                          <TableCell>$150</TableCell>
                          <TableCell>{t('pricing.fees.annual')}</TableCell>
                        </TableRow>
                        <TableRow key="activities">
                          <TableCell>{t('pricing.fees.activities')}</TableCell>
                          <TableCell>$180</TableCell>
                          <TableCell>{t('pricing.fees.annual')}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardBody>
                <Divider/>
                <CardFooter>
                  <Button
                    as={NextLink}
                    href={`/${locale}${siteConfig.links.apply}`}
                    className={buttonStyles({
                      color: "primary",
                      radius: "full",
                    })}
                  >
                    {t('buttons.applyNow')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </Tab>
          <Tab key="secondary" title={t('pricing.levels.secondary.title')}>
            <div className="mt-8 max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <h3 className="text-2xl font-bold">{t('pricing.levels.secondary.programTitle')}</h3>
                  <p className="text-default-500">{t('pricing.levels.secondary.description')}</p>
                </CardHeader>
                <Divider/>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-primary mb-2">Program Overview</h4>
                      <p className="text-default-600">
                        {t('pricing.levels.secondary.overview')}
                      </p>
                    </div>
                    
                    <Table aria-label="Middle & High School Fees">
                      <TableHeader>
                        <TableColumn>{t('pricing.fees.title')}</TableColumn>
                        <TableColumn>{t('pricing.fees.amount')}</TableColumn>
                        <TableColumn>{t('pricing.fees.details')}</TableColumn>
                      </TableHeader>
                      <TableBody>
                        <TableRow key="tuition">
                          <TableCell>{t('pricing.fees.tuition')}</TableCell>
                          <TableCell>{t('pricing.levels.secondary.price')}</TableCell>
                          <TableCell>{t('pricing.fees.installments')}</TableCell>
                        </TableRow>
                        <TableRow key="registration">
                          <TableCell>{t('pricing.fees.registration')}</TableCell>
                          <TableCell>$300</TableCell>
                          <TableCell>{t('pricing.fees.nonRefundable')}</TableCell>
                        </TableRow>
                        <TableRow key="materials">
                          <TableCell>{t('pricing.fees.books')}</TableCell>
                          <TableCell>$250</TableCell>
                          <TableCell>{t('pricing.fees.annual')}</TableCell>
                        </TableRow>
                        <TableRow key="technology">
                          <TableCell>{t('pricing.fees.technology')}</TableCell>
                          <TableCell>$200</TableCell>
                          <TableCell>{t('pricing.fees.annual')}</TableCell>
                        </TableRow>
                        <TableRow key="activities">
                          <TableCell>{t('pricing.fees.activities')}</TableCell>
                          <TableCell>$220</TableCell>
                          <TableCell>{t('pricing.fees.annual')}</TableCell>
                        </TableRow>
                        <TableRow key="exam">
                          <TableCell>{t('pricing.fees.exam')}</TableCell>
                          <TableCell>$180</TableCell>
                          <TableCell>{t('pricing.fees.annual')}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardBody>
                <Divider/>
                <CardFooter>
                  <Button
                    as={NextLink}
                    href={`/${locale}${siteConfig.links.apply}`}
                    className={buttonStyles({
                      color: "primary",
                      radius: "full",
                    })}
                  >
                    {t('buttons.applyNow')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </section>

      {/* Payment Options */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('pricing.payment.title')}</h2>
          <p className="text-default-500 mt-2 max-w-2xl mx-auto">
            {t('pricing.payment.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border border-divider">
            <CardHeader>
              <h3 className="text-xl font-bold">{t('pricing.payment.annual.title')}</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 text-sm">{t('pricing.payment.annual.description')}</p>
            </CardBody>
          </Card>
          
          <Card className="border border-divider">
            <CardHeader>
              <h3 className="text-xl font-bold">{t('pricing.payment.semester.title')}</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 text-sm">{t('pricing.payment.semester.description')}</p>
            </CardBody>
          </Card>
          
          <Card className="border border-divider">
            <CardHeader>
              <h3 className="text-xl font-bold">{t('pricing.payment.quarterly.title')}</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600 text-sm">{t('pricing.payment.quarterly.description')}</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Financial Aid */}
      <section className="bg-primary/10 p-8 rounded-2xl space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('pricing.financial.title')}</h2>
          <p className="text-default-600 mt-2 max-w-2xl mx-auto">
            {t('pricing.financial.description')}
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            as={NextLink}
            href={`/${locale}/contact`}
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
          >
            {t('pricing.financial.contact')}
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('pricing.faq.title')}</h2>
        </div>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          <Card className="border border-divider">
            <CardBody>
              <h4 className="text-lg font-semibold">{t('pricing.faq.additionalFees.question')}</h4>
              <p className="text-default-500 mt-2">
                {t('pricing.faq.additionalFees.answer')}
              </p>
            </CardBody>
          </Card>
          
          <Card className="border border-divider">
            <CardBody>
              <h4 className="text-lg font-semibold">{t('pricing.faq.siblingDiscount.question')}</h4>
              <p className="text-default-500 mt-2">
                {t('pricing.faq.siblingDiscount.answer')}
              </p>
            </CardBody>
          </Card>
          
          <Card className="border border-divider">
            <CardBody>
              <h4 className="text-lg font-semibold">{t('pricing.faq.refundPolicy.question')}</h4>
              <p className="text-default-500 mt-2">
                {t('pricing.faq.refundPolicy.answer')}
              </p>
            </CardBody>
          </Card>
          
          <Card className="border border-divider">
            <CardBody>
              <h4 className="text-lg font-semibold">{t('pricing.faq.financialAid.question')}</h4>
              <p className="text-default-500 mt-2">
                {t('pricing.faq.financialAid.answer')}
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4">
        <h2 className={title({ size: "sm" })}>{t('pricing.cta.title')}</h2>
        <p className="text-default-500 max-w-2xl mx-auto">
          {t('pricing.cta.description')}
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
