import { title, subtitle } from "@/components/primitives";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/switch";
import { RadioGroup, Radio } from "@heroui/radio";
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";
import { button as buttonStyles } from "@heroui/theme";
import { Link } from "@heroui/link";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";

export default function ApplicationPage() {
  return (
    <div className="flex flex-col gap-16 py-8 md:py-10">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className={title()}>Application Form</h1>
        <p className={subtitle({ class: "max-w-3xl mx-auto" })}>
          Complete the form below to apply for admission to Young African Leaders School
        </p>
      </section>

      {/* Application Form */}
      <section>
        <Card className="border border-divider max-w-5xl mx-auto">
          <CardHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Student Application</h2>
            <p className="text-default-500">
              Please fill out all required fields. Fields marked with an asterisk (*) are required.
            </p>
          </CardHeader>
          <Divider />
          <CardBody>
            <Tabs aria-label="Application sections">
              <Tab key="student" title="Student Information">
                <div className="py-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      label="First Name *"
                      placeholder="Enter student's first name"
                      isRequired
                    />
                    <Input
                      type="text"
                      label="Last Name *"
                      placeholder="Enter student's last name"
                      isRequired
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      type="date"
                      label="Date of Birth *"
                      placeholder="MM/DD/YYYY"
                      isRequired
                    />
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Gender *
                      </label>
                      <RadioGroup orientation="horizontal">
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                        <Radio value="other">Other</Radio>
                      </RadioGroup>
                    </div>
                    <Select
                      label="Grade Applying For *"
                      placeholder="Select grade level"
                      isRequired
                    >
                      <SelectItem key="preschool" value="preschool">Preschool</SelectItem>
                      <SelectItem key="kindergarten" value="kindergarten">Kindergarten</SelectItem>
                      <SelectItem key="grade1" value="grade1">Grade 1</SelectItem>
                      <SelectItem key="grade2" value="grade2">Grade 2</SelectItem>
                      <SelectItem key="grade3" value="grade3">Grade 3</SelectItem>
                      <SelectItem key="grade4" value="grade4">Grade 4</SelectItem>
                      <SelectItem key="grade5" value="grade5">Grade 5</SelectItem>
                      <SelectItem key="grade6" value="grade6">Grade 6</SelectItem>
                      <SelectItem key="grade7" value="grade7">Grade 7</SelectItem>
                      <SelectItem key="grade8" value="grade8">Grade 8</SelectItem>
                      <SelectItem key="grade9" value="grade9">Grade 9</SelectItem>
                      <SelectItem key="grade10" value="grade10">Grade 10</SelectItem>
                      <SelectItem key="grade11" value="grade11">Grade 11</SelectItem>
                      <SelectItem key="grade12" value="grade12">Grade 12</SelectItem>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      label="Nationality"
                      placeholder="Enter student's nationality"
                    />
                    <Input
                      type="text"
                      label="Primary Language"
                      placeholder="Enter student's primary language"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      English Proficiency Level *
                    </label>
                    <RadioGroup orientation="horizontal">
                      <Radio value="beginner">Beginner</Radio>
                      <Radio value="intermediate">Intermediate</Radio>
                      <Radio value="advanced">Advanced</Radio>
                      <Radio value="native">Native Speaker</Radio>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Does the student have any special educational needs or require accommodations? *
                    </label>
                    <RadioGroup>
                      <Radio value="yes">Yes (please specify below)</Radio>
                      <Radio value="no">No</Radio>
                    </RadioGroup>
                    <Textarea
                      className="mt-2"
                      placeholder="If yes, please provide details to help us better support your child"
                      minRows={2}
                    />
                  </div>
                </div>
              </Tab>
              
              <Tab key="parent" title="Parent/Guardian Information">
                <div className="py-4 space-y-6">
                  <h3 className="text-lg font-semibold">Primary Parent/Guardian</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      label="First Name *"
                      placeholder="Enter first name"
                      isRequired
                    />
                    <Input
                      type="text"
                      label="Last Name *"
                      placeholder="Enter last name"
                      isRequired
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      label="Relationship to Student *"
                      placeholder="e.g., Mother, Father, Guardian"
                      isRequired
                    />
                    <Input
                      type="email"
                      label="Email Address *"
                      placeholder="Enter email address"
                      isRequired
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="tel"
                      label="Phone Number *"
                      placeholder="Enter phone number"
                      isRequired
                    />
                    <Input
                      type="text"
                      label="Occupation"
                      placeholder="Enter occupation"
                    />
                  </div>
                  
                  <Input
                    type="text"
                    label="Home Address *"
                    placeholder="Enter home address"
                    isRequired
                  />
                  
                  <Divider className="my-4" />
                  
                  <h3 className="text-lg font-semibold">Secondary Parent/Guardian (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      label="First Name"
                      placeholder="Enter first name"
                    />
                    <Input
                      type="text"
                      label="Last Name"
                      placeholder="Enter last name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      label="Relationship to Student"
                      placeholder="e.g., Mother, Father, Guardian"
                    />
                    <Input
                      type="email"
                      label="Email Address"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="tel"
                      label="Phone Number"
                      placeholder="Enter phone number"
                    />
                    <Input
                      type="text"
                      label="Occupation"
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>
              </Tab>
              
              <Tab key="academic" title="Academic History">
                <div className="py-4 space-y-6">
                  <h3 className="text-lg font-semibold">Current/Previous School Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      label="School Name *"
                      placeholder="Enter school name"
                      isRequired
                    />
                    <Input
                      type="text"
                      label="City/Country *"
                      placeholder="Enter city and country"
                      isRequired
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      label="Current Grade/Year *"
                      placeholder="Enter current grade/year"
                      isRequired
                    />
                    <Input
                      type="text"
                      label="Years Attended"
                      placeholder="e.g., 2020-2023"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      label="Language of Instruction"
                      placeholder="Enter language of instruction"
                    />
                    <Input
                      type="text"
                      label="Curriculum (e.g., National, IB, etc.)"
                      placeholder="Enter curriculum type"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Reason for Leaving Current School
                    </label>
                    <Textarea
                      placeholder="Please explain the reason for leaving your current school"
                      minRows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Has the student ever been dismissed, suspended, or placed on probation from any school? *
                    </label>
                    <RadioGroup>
                      <Radio value="yes">Yes (please explain below)</Radio>
                      <Radio value="no">No</Radio>
                    </RadioGroup>
                    <Textarea
                      className="mt-2"
                      placeholder="If yes, please provide details"
                      minRows={2}
                    />
                  </div>
                </div>
              </Tab>
              
              <Tab key="additional" title="Additional Information">
                <div className="py-4 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Student's Interests and Hobbies
                    </label>
                    <Textarea
                      placeholder="Please share your child's interests, hobbies, and extracurricular activities"
                      minRows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Student's Strengths and Areas for Growth
                    </label>
                    <Textarea
                      placeholder="Please describe your child's academic and personal strengths and areas where they may need additional support"
                      minRows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Why have you chosen YALS for your child's education? *
                    </label>
                    <Textarea
                      placeholder="Please explain why you are interested in YALS for your child"
                      minRows={3}
                      isRequired
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      How did you hear about YALS? *
                    </label>
                    <Select placeholder="Select an option" isRequired>
                      <SelectItem key="friend" value="friend">Friend/Family Referral</SelectItem>
                      <SelectItem key="internet" value="internet">Internet Search</SelectItem>
                      <SelectItem key="social" value="social">Social Media</SelectItem>
                      <SelectItem key="event" value="event">Educational Event/Fair</SelectItem>
                      <SelectItem key="newspaper" value="newspaper">Newspaper/Magazine</SelectItem>
                      <SelectItem key="other" value="other">Other</SelectItem>
                    </Select>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Checkbox size="sm" />
                    <p className="text-default-500 text-sm">
                      I give permission for YALS to contact my child's current/previous school for additional information if needed.
                    </p>
                  </div>
                </div>
              </Tab>
              
              <Tab key="documents" title="Required Documents">
                <div className="py-4 space-y-6">
                  <p className="text-default-600">
                    Please prepare the following documents to complete your application. You will be asked to upload these documents after submitting this form.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Checkbox size="sm" />
                      <div>
                        <p className="font-medium">Two recent passport-sized photographs</p>
                        <p className="text-default-500 text-sm">Two recent passport-sized photos of the student, taken on a light background.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox size="sm" />
                      <div>
                        <p className="font-medium">Copy of student's identification</p>
                        <p className="text-default-500 text-sm">A copy of a valid identification document for the student (passport, national ID, or birth certificate).</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox size="sm" />
                      <div>
                        <p className="font-medium">Copy of parent/guardian identification</p>
                        <p className="text-default-500 text-sm">A copy of the parent or legal guardian's identification.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox size="sm" />
                      <div>
                        <p className="font-medium">Previous school reports/transcripts</p>
                        <p className="text-default-500 text-sm">Copies of the student's previous school reports or transcripts (if applicable).</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox size="sm" />
                      <div>
                        <p className="font-medium">Health and immunization records</p>
                        <p className="text-default-500 text-sm">Up-to-date health and immunization records.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-default-600 font-medium">Application Fee</p>
                    <p className="text-default-500 text-sm mt-1">
                      A non-refundable application fee of $50 is required to process your application. Payment instructions will be provided after form submission.
                    </p>
                  </div>
                </div>
              </Tab>
              
              <Tab key="review" title="Review & Submit">
                <div className="py-4 space-y-6">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="font-medium">Before submitting your application, please ensure that:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-default-600 text-sm">
                      <li>All required fields (marked with *) have been completed</li>
                      <li>The information provided is accurate and up-to-date</li>
                      <li>You have prepared the required documents for upload</li>
                      <li>You understand that a non-refundable application fee of $50 is required</li>
                    </ul>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Checkbox size="sm" isRequired />
                    <p className="text-default-600 text-sm">
                      I certify that the information provided in this application is complete and accurate. I understand that any misrepresentation may result in the cancellation of the application or the withdrawal of an offer of admission. *
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Checkbox size="sm" isRequired />
                    <p className="text-default-600 text-sm">
                      I have read and agree to the <Link href="/privacy" className="text-primary">Privacy Policy</Link> and <Link href="/terms" className="text-primary">Terms of Service</Link>. *
                    </p>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
          <Divider />
          <CardFooter className="flex justify-between">
            <Button
              className={buttonStyles({
                variant: "light",
              })}
            >
              Save as Draft
            </Button>
            <div className="flex gap-2">
              <Button
                className={buttonStyles({
                  variant: "bordered",
                })}
                as={NextLink}
                href="/admissions"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={buttonStyles({
                  color: "primary",
                  variant: "shadow",
                })}
              >
                Submit Application
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>

      {/* Help Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold">Need Help?</h2>
        <p className="text-default-600">
          If you have any questions or need assistance with your application, please don't hesitate to contact our admissions office.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            as={NextLink}
            href="/contact"
            className={buttonStyles({
              variant: "bordered",
              radius: "full",
            })}
          >
            Contact Us
          </Button>
          <Button
            as={Link}
            href={`mailto:${siteConfig.links.email}`}
            className={buttonStyles({
              variant: "light",
              radius: "full",
            })}
          >
            Email Admissions
          </Button>
        </div>
      </section>
    </div>
  );
}
