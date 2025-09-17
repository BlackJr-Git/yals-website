import { title, subtitle } from "@/components/primitives";
import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";

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
const ValueCard = ({ title, description }: { title: string; description: string }) => (
  <Card className="border border-divider bg-content1">
    <CardBody className="p-5">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-default-500 text-sm">{description}</p>
    </CardBody>
  </Card>
);

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 py-8 md:py-10 w-full">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex-1 space-y-6">
          <h1 className={title()}>About YALS</h1>
          <p className={subtitle({ class: "max-w-3xl" })}>
            Founded in 2017 in Kinshasa, Young African Leaders School is a premium, English-speaking international school dedicated to shaping Africa's next generation of leaders.
          </p>
          <p className="text-default-500 text-lg">
            At YALS, we believe that quality education is the foundation of strong leadership. Our mission is to provide a world-class, English-immersive education that empowers students to become confident, capable leaders who can make a positive impact in their communities and beyond.
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
      <section className="w-full py-16 bg-default-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className={title({ size: "sm" })}>Our Story</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                isBlurred
                width={600}
                height={400}
                alt="YALS History"
                className="object-cover rounded-xl shadow-lg w-full"
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2664&auto=format&fit=crop"
              />
            </div>
            <div className="space-y-4">
              <p className="text-default-600">
                Young African Leaders School (YALS) was founded in 2017 by a group of passionate educators and community leaders who recognized the need for high-quality, English-language education in Kinshasa. Starting with just 35 students and 5 teachers, our school has grown to serve hundreds of students across all grade levels.
              </p>
              <p className="text-default-600">
                Our founders envisioned a school that would not only provide academic excellence but would also instill leadership values, global awareness, and community responsibility. This vision continues to guide our approach to education today.
              </p>
              <p className="text-default-600">
                Over the years, YALS has established itself as a premier educational institution in the Democratic Republic of Congo, known for its rigorous academic standards, English immersion environment, and focus on developing well-rounded future leaders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className={title({ size: "sm" })}>Our Core Values</h2>
            <p className="text-default-500 mt-2 max-w-3xl mx-auto">
              These principles guide everything we do at YALS, from curriculum development to community engagement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <ValueCard 
              title="Academic Excellence" 
              description="We maintain high standards and expectations, challenging our students to achieve their full potential through rigorous, engaging curriculum and innovative teaching methods."
            />
            <ValueCard 
              title="Leadership Development" 
              description="We cultivate leadership skills in every student, encouraging them to take initiative, solve problems creatively, and make positive contributions to their communities."
            />
            <ValueCard 
              title="Global Perspective" 
              description="We prepare students to be global citizens by exposing them to diverse cultures, languages, and perspectives, fostering respect and understanding for people from all backgrounds."
            />
            <ValueCard 
              title="Character Building" 
              description="We emphasize integrity, responsibility, empathy, and resilience as essential qualities for personal growth and effective leadership."
            />
            <ValueCard 
              title="Innovation & Creativity" 
              description="We encourage creative thinking and innovative approaches to learning and problem-solving, preparing students for the challenges of a rapidly changing world."
            />
            <ValueCard 
              title="Community Engagement" 
              description="We believe in the importance of service and active participation in community life, teaching students to use their knowledge and skills for the greater good."
            />
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="w-full py-16 bg-primary/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className={title({ size: "sm" })}>Our Educational Approach</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="bg-white/50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-3">English Immersion</h3>
              <p className="text-default-600">
                At YALS, all classes are taught in English by qualified educators, creating a full immersion environment that helps students develop strong English language skills naturally and effectively.
              </p>
            </div>
            
            <div className="bg-white/50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-3">Small Class Sizes</h3>
              <p className="text-default-600">
                We maintain small class sizes to ensure each student receives personalized attention and support, allowing teachers to address individual learning needs and foster meaningful connections.
              </p>
            </div>
          
            <div className="bg-white/50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-3">STEM Focus</h3>
              <p className="text-default-600">
                Our curriculum emphasizes Science, Technology, Engineering, and Mathematics, preparing students for future careers in these high-demand fields while developing critical thinking and problem-solving skills.
              </p>
            </div>
            
            <div className="bg-white/50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-3">Leadership Integration</h3>
              <p className="text-default-600">
                Leadership principles are woven throughout our curriculum and extracurricular activities, giving students regular opportunities to practice and develop their leadership abilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className={title({ size: "sm" })}>Our Leadership Team</h2>
            <p className="text-default-500 mt-2 max-w-3xl mx-auto">
              Meet the dedicated educators and administrators who guide our school's vision and operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            <TeamMemberCard 
              name="Dr. Marie Nkosi" 
              role="School Director"
              image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
              bio="With over 20 years of experience in international education, Dr. Nkosi leads YALS with a passion for developing young leaders and educational excellence."
            />
            <TeamMemberCard 
              name="Prof. Jean Mutombo" 
              role="Academic Director"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
              bio="Professor Mutombo oversees our curriculum development and teaching standards, bringing his expertise in educational psychology and bilingual education."
            />
            <TeamMemberCard 
              name="Ms. Sarah Okito" 
              role="Student Affairs Coordinator"
              image="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2670&auto=format&fit=crop"
              bio="Ms. Okito manages student support services and extracurricular programs, ensuring a holistic approach to student development and well-being."
            />
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="w-full py-16 bg-default-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className={title({ size: "sm" })}>Our Campus & Facilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 items-center">
            <div>
              <Image
                isBlurred
                width={600}
                height={400}
                alt="YALS Campus"
                className="object-cover rounded-xl shadow-lg w-full"
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop"
              />
            </div>
            <div className="space-y-4">
              <p className="text-default-600 text-lg">
                Our modern campus in Kinshasa provides a safe, stimulating environment for learning and growth. Our facilities include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-primary mb-2">Learning Spaces</h4>
                  <ul className="list-disc list-inside space-y-1 text-default-600 text-sm">
                    <li>Bright, well-equipped classrooms</li>
                    <li>Science and computer laboratories</li>
                    <li>Library and resource center</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-primary mb-2">Creative Arts</h4>
                  <ul className="list-disc list-inside space-y-1 text-default-600 text-sm">
                    <li>Art studios</li>
                    <li>Music rooms</li>
                    <li>Performance spaces</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-primary mb-2">Physical Activities</h4>
                  <ul className="list-disc list-inside space-y-1 text-default-600 text-sm">
                    <li>Multi-purpose sports court</li>
                    <li>Outdoor play areas</li>
                    <li>Fitness equipment</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-primary mb-2">Student Services</h4>
                  <ul className="list-disc list-inside space-y-1 text-default-600 text-sm">
                    <li>Cafeteria with nutritious meals</li>
                    <li>Health and wellness center</li>
                    <li>Student lounge areas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation Section */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className={title({ size: "sm" })}>Accreditation & Affiliations</h2>
            <p className="text-default-600 max-w-3xl mx-auto mt-4">
              YALS is recognized by the Ministry of Education of the Democratic Republic of Congo and maintains partnerships with international educational organizations to ensure our curriculum meets global standards.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="font-bold text-primary">Partner 1</span>
                </div>
                <p className="text-sm text-center text-default-500">Ministry of Education DRC</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="font-bold text-primary">Partner 2</span>
                </div>
                <p className="text-sm text-center text-default-500">International Schools Association</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="font-bold text-primary">Partner 3</span>
                </div>
                <p className="text-sm text-center text-default-500">Global Education Council</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="font-bold text-primary">Partner 4</span>
                </div>
                <p className="text-sm text-center text-default-500">African Leadership Network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the YALS Community</h2>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            We invite you to become part of our vibrant learning community. Schedule a visit to our campus to see firsthand how YALS is shaping the leaders of tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              as={NextLink}
              href={siteConfig.links.apply}
              className={buttonStyles({
                color: "default",
                radius: "full",
                variant: "shadow",
                size: "lg",
              })}
            >
              Apply Now
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
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
