"use client";

import { useState } from "react";
import { title, subtitle } from "@/components/primitives";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";
import { Progress } from "@heroui/progress";

import { siteConfig } from "@/config/site";

export default function ApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Student Information</h3>
            <p className="text-default-600">
              In this section, you'll provide basic information about the
              student applying for admission.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Parents/Guardians</h3>
            <p className="text-default-600">
              Please provide information about the student's parents or legal
              guardians.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Health and Education</h3>
            <p className="text-default-600">
              Information about the student's health, educational background,
              and special needs.
            </p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Documents and Consents</h3>
            <p className="text-default-600">
              Required documents and consent forms to complete your application.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-16 py-8 md:py-10">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className={title()}>Application Form</h1>
        <p className={subtitle({ class: "max-w-3xl mx-auto" })}>
          Complete the form below to apply for admission to Young African
          Leaders School
        </p>
      </section>

      {/* Application Form */}
      <section>
        <Card className="border border-divider max-w-5xl mx-auto">
          <CardHeader className="flex flex-col gap-4 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 w-full">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  Student Application
                </h2>
                <p className="text-default-500 text-sm mt-1">
                  Complete all required information to submit your application
                </p>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full">
                <span className="text-primary font-medium">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
            </div>

            <div className="mt-6 w-full">
              {/* Stepper */}
              <div className="flex justify-between mb-8 px-6 relative w-full">
                {/* Connecting Line */}
                <div className="absolute h-1 bg-default-200 left-[12%] right-[12%] top-6 transform -translate-y-1/2"></div>

                {/* Step 1 */}
                <div
                  className="flex flex-col items-center z-10 mx-2"
                  style={{ minWidth: "60px" }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-medium ${currentStep >= 1 ? "bg-primary text-white" : "bg-default-100 text-default-500"} ${currentStep === 1 ? "ring-4 ring-primary/30 ring-offset-2" : ""} shadow-md`}
                  >
                    1
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${currentStep === 1 ? "text-primary font-medium" : "text-default-500"}`}
                  >
                    Student Information
                  </span>
                </div>

                {/* Step 2 */}
                <div
                  className="flex flex-col items-center z-10 mx-2"
                  style={{ minWidth: "60px" }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-medium ${currentStep >= 2 ? "bg-primary text-white" : "bg-default-100 text-default-500"} ${currentStep === 2 ? "ring-4 ring-primary/30 ring-offset-2" : ""} shadow-md`}
                  >
                    2
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${currentStep === 2 ? "text-primary font-medium" : "text-default-500"}`}
                  >
                    Parents/Guardians
                  </span>
                </div>

                {/* Step 3 */}
                <div
                  className="flex flex-col items-center z-10 mx-2"
                  style={{ minWidth: "60px" }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-medium ${currentStep >= 3 ? "bg-primary text-white" : "bg-default-100 text-default-500"} ${currentStep === 3 ? "ring-4 ring-primary/30 ring-offset-2" : ""} shadow-md`}
                  >
                    3
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${currentStep === 3 ? "text-primary font-medium" : "text-default-500"}`}
                  >
                    Health and Education
                  </span>
                </div>

                {/* Step 4 */}
                <div
                  className="flex flex-col items-center z-10 mx-2"
                  style={{ minWidth: "60px" }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-medium ${currentStep >= 4 ? "bg-primary text-white" : "bg-default-100 text-default-500"} ${currentStep === 4 ? "ring-4 ring-primary/30 ring-offset-2" : ""} shadow-md`}
                  >
                    4
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${currentStep === 4 ? "text-primary font-medium" : "text-default-500"}`}
                  >
                    Documents and Consents
                  </span>
                </div>
              </div>

              <Progress
                value={(currentStep / totalSteps) * 100}
                className="mt-2"
                color="primary"
                size="md"
                showValueLabel={false}
              />
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="py-8">{renderStepContent()}</CardBody>
          <Divider />
          <CardFooter className="flex justify-between">
            <Button
              className={buttonStyles({
                variant: "light",
              })}
              onClick={handlePrevious}
              isDisabled={currentStep === 1}
            >
              Previous
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
              {currentStep < totalSteps ? (
                <Button
                  className={buttonStyles({
                    color: "primary",
                  })}
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className={buttonStyles({
                    color: "primary",
                    variant: "shadow",
                  })}
                >
                  Submit Application
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </section>

      {/* Help Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto mt-16">
        <h2 className="text-xl font-bold">Need Help?</h2>
        <p className="text-default-600">
          If you have any questions or need assistance with your application,
          please don't hesitate to contact our admissions office.
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
            as={NextLink}
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
