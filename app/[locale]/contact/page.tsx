import { title, subtitle } from "@/components/primitives";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { useTranslations } from 'next-intl';

import { siteConfig } from "@/config/site";

export default function ContactPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-16 py-8 md:py-10">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className={title()}>{t('contact.hero.title')}</h1>
        <p className={subtitle({ class: "max-w-3xl mx-auto" })}>
          {t('contact.hero.description')}
        </p>
      </section>

      {/* Contact Information and Form */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-8">
          <Card className="border border-divider">
            <CardBody className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">{t('contact.info.visit')}</h2>
                <p className="text-default-600 mb-2">
                  <span className="text-primary mr-2">📍</span>
                  {siteConfig.links.address}
                </p>
                <div className="mt-4 aspect-video bg-default-100 rounded-lg flex items-center justify-center">
                  <p className="text-default-500">Map Placeholder</p>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <h2 className="text-2xl font-bold mb-4">{t('contact.info.contact')}</h2>
                <div className="space-y-4">
                  <p className="flex items-center gap-2">
                    <span className="text-primary">📞</span>
                    <Link href={`tel:${siteConfig.links.phone}`} className="text-default-600 hover:text-primary transition-colors">
                      {siteConfig.links.phone}
                    </Link>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary">✉️</span>
                    <Link href={`mailto:${siteConfig.links.email}`} className="text-default-600 hover:text-primary transition-colors">
                      {siteConfig.links.email}
                    </Link>
                  </p>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <h2 className="text-2xl font-bold mb-4">{t('contact.info.hours')}</h2>
                <div className="space-y-2">
                  <p className="text-default-600">
                    {t('contact.info.weekdays')}
                  </p>
                  <p className="text-default-600">
                    {t('contact.info.saturday')}
                  </p>
                  <p className="text-default-600">
                    {t('contact.info.sunday')}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Contact Form */}
        <div>
          <Card className="border border-divider">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold mb-6">{t('contact.form.title')}</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label={t('contact.form.firstName')}
                    placeholder={t('contact.form.firstName')}
                    isRequired
                  />
                  <Input
                    type="text"
                    label={t('contact.form.lastName')}
                    placeholder={t('contact.form.lastName')}
                    isRequired
                  />
                </div>
                <Input
                  type="email"
                  label={t('contact.form.email')}
                  placeholder={t('contact.form.email')}
                  isRequired
                />
                <Input
                  type="tel"
                  label={t('contact.form.phone')}
                  placeholder={t('contact.form.phone')}
                />
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {t('contact.form.interest')}
                  </label>
                  <select className="w-full bg-default-100 rounded-lg px-3 py-2 text-default-700 border-2 border-transparent focus:border-primary focus:outline-none">
                    <option>General Information</option>
                    <option>Admissions</option>
                    <option>Tuition & Fees</option>
                    <option>Academic Programs</option>
                    <option>Campus Visit</option>
                    <option>Other</option>
                  </select>
                </div>
                <Textarea
                  label={t('contact.form.message')}
                  placeholder={t('contact.form.message')}
                  minRows={4}
                  isRequired
                />
                <Button
                  type="submit"
                  className={buttonStyles({
                    color: "primary",
                    radius: "full",
                    variant: "shadow",
                    fullWidth: true,
                  })}
                >
                  {t('contact.form.submit')}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className={title({ size: "sm" })}>{t('contact.faq.title')}</h2>
          <p className="text-default-500 mt-2 max-w-2xl mx-auto">
            {t('contact.faq.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="border border-divider">
            <CardBody className="p-5">
              <h3 className="text-lg font-semibold mb-2">How can I schedule a campus tour?</h3>
              <p className="text-default-500">
                You can schedule a campus tour by contacting our admissions office via phone or email, or by filling out the contact form on this page. Tours are typically available Monday through Friday during school hours.
              </p>
            </CardBody>
          </Card>
          
          <Card className="border border-divider">
            <CardBody className="p-5">
              <h3 className="text-lg font-semibold mb-2">Who should I contact about admissions?</h3>
              <p className="text-default-500">
                For admissions inquiries, please contact our admissions office directly at {siteConfig.links.email} or visit our Admissions page for detailed information about the application process.
              </p>
            </CardBody>
          </Card>
          
          <Card className="border border-divider">
            <CardBody className="p-5">
              <h3 className="text-lg font-semibold mb-2">How long does it take to receive a response?</h3>
              <p className="text-default-500">
                We strive to respond to all inquiries within 24-48 business hours. For urgent matters, we recommend contacting us by phone.
              </p>
            </CardBody>
          </Card>
          
          <Card className="border border-divider">
            <CardBody className="p-5">
              <h3 className="text-lg font-semibold mb-2">Is there parking available for visitors?</h3>
              <p className="text-default-500">
                Yes, visitor parking is available on campus. Please check in at the main office upon arrival, where you will receive a visitor's pass and parking instructions.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 p-8 rounded-2xl text-center space-y-6">
        <h2 className={title({ size: "sm" })}>{t('about.cta.title')}</h2>
        <p className="text-default-600 max-w-2xl mx-auto">
          {t('about.cta.description')}
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button
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
    </div>
  );
}
