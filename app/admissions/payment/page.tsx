"use client";

import { useState } from "react";
import { title, subtitle } from "@/components/primitives";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { siteConfig } from "@/config/site";

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  // État du formulaire adapté au nouveau format API
  const [formData, setFormData] = useState({
    code: "", // Remplace applicationReference
    reason: "admission" as "admission" | "scolarity", // Raison fixée à "admission"
    academic_year_id: 1, // Année académique par défaut
    paytype: "", // Type de paiement
    payer_email: "", // Email du payeur
    payer_phone: "", // Téléphone du payeur
    payer_name: "", // Nom du payeur (facultatif)
    confirmTerms: false // Pour la vérification des conditions
  });
  
  // État pour stocker la référence de facture après paiement
  const [invoiceRef, setInvoiceRef] = useState<string | null>(null);

  // Gestion des changements dans le formulaire
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Validation basique pour l'étape 1
      if (currentStep === 1) {
        if (
          !formData.code ||
          !formData.payer_email ||
          !formData.payer_phone ||
          !formData.paytype
        ) {
          alert("Please fill in all required fields before proceeding.");
          return;
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitPayment = async () => {
    // Validation pour l'étape finale
    if (!formData.confirmTerms) {
      alert("Please confirm that all information is correct to proceed.");
      return;
    }

    try {
      // Préparer les données de paiement
      const paymentData = {
        code: formData.code,
        reason: formData.reason,
        academic_year_id: formData.academic_year_id,
        paytype: formData.paytype,
        payer_email: formData.payer_email,
        payer_phone: formData.payer_phone,
        payer_name: formData.payer_name || formData.payer_email.split('@')[0] // Utiliser la première partie de l'email si le nom n'est pas fourni
      };
      
      // Appel API pour traiter le paiement
      const response = await fetch('/api/admissions/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Sauvegarder la référence de facture pour vérification ultérieure
        setInvoiceRef(result.data.ref);
        alert(`Payment request processed successfully! Reference: ${result.data.ref}`);
        // Redirection vers une page de succès
        // window.location.href = `/admissions/payment/success?ref=${result.data.ref}`;
      } else {
        alert(`Error processing payment: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-center mb-2">Payment Information</h3>
              <p className="text-default-600 text-center mb-8">Enter your payment details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <Input
                  isRequired
                  label="Application Reference Code *"
                  placeholder="Enter application reference code"
                  value={formData.code}
                  onValueChange={(value) => handleInputChange("code", value)}
                />
              </div>
              
              <div className="col-span-1">
                <Input
                  isRequired
                  type="email"
                  label="Payer Email *"
                  placeholder="Enter email address"
                  value={formData.payer_email}
                  onValueChange={(value) => handleInputChange("payer_email", value)}
                />
              </div>
              
              <div className="col-span-1">
                <Input
                  isRequired
                  type="tel"
                  label="Payer Phone *"
                  placeholder="+243 123 456 789"
                  value={formData.payer_phone}
                  onValueChange={(value) => handleInputChange("payer_phone", value)}
                />
              </div>
              
              <div className="col-span-1">
                <Select
                  isRequired
                  label="Payment Method *"
                  placeholder="Select payment method"
                  selectedKeys={formData.paytype ? [formData.paytype] : []}
                  onSelectionChange={(keys) => handleInputChange("paytype", Array.from(keys)[0] as string)}
                >
                  <SelectItem key="maxicash">MaxiCash</SelectItem>
                  <SelectItem key="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem key="credit_card">Credit Card</SelectItem>
                  <SelectItem key="cash">Cash</SelectItem>
                </Select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-center mb-2">Payment Confirmation</h3>
              <p className="text-default-600 text-center mb-8">Review your payment details before submitting</p>
            </div>

            <div className="space-y-6">
              <div className="bg-default-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium mb-4">Application Details</h4>
                <div className="flex border-b border-divider py-3">
                  <span className="font-medium w-1/3">Application Code:</span>
                  <span className="text-default-700">{formData.code}</span>
                </div>
                <div className="flex border-b border-divider py-3">
                  <span className="font-medium w-1/3">Payment Reason:</span>
                  <span className="text-default-700">{formData.reason === "admission" ? "Admission" : "Scolarity"}</span>
                </div>
                <div className="flex border-b border-divider py-3">
                  <span className="font-medium w-1/3">Academic Year:</span>
                  <span className="text-default-700">{2024 + formData.academic_year_id}</span>
                </div>
              </div>

              <div className="bg-default-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium mb-4">Payer Information</h4>
                <div className="flex border-b border-divider py-3">
                  <span className="font-medium w-1/3">Email:</span>
                  <span className="text-default-700">{formData.payer_email}</span>
                </div>
                <div className="flex border-b border-divider py-3">
                  <span className="font-medium w-1/3">Phone:</span>
                  <span className="text-default-700">{formData.payer_phone}</span>
                </div>
                <div className="flex py-3">
                  <span className="font-medium w-1/3">Payment Method:</span>
                  <span className="text-default-700">{formData.paytype}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  isSelected={formData.confirmTerms}
                  onValueChange={(value) => handleInputChange("confirmTerms", value)}
                />
                <span className="text-sm">
                  I confirm that all the information provided is correct and I agree to the terms and conditions of payment
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className={title()}>YALS Payment</h1>
        <p className={subtitle({ class: "max-w-3xl mx-auto" })}>
          Complete your admission process by making a payment
        </p>
      </section>

      {/* Payment Form - New Layout */}
      <section>
        <Card className="border border-divider w-full overflow-hidden">
          <div className="flex flex-row">
            {/* Left Sidebar with Steps */}
            <div className="w-1/4 min-w-[250px] border-r border-divider bg-content1 py-8 px-4">
              <div className="mb-8">
                <h2 className="text-lg font-bold text-primary flex items-center">
                  YALS
                </h2>
              </div>
              
              {/* Vertical Progress Steps */}
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm 
                    ${currentStep >= 1 ? "bg-primary text-white border-2 border-primary" : "border-2 border-default-200 text-default-400"}`}
                  >
                    {currentStep > 1 ? "✓" : "1"}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${currentStep === 1 ? "text-primary" : "text-default-700"}`}>
                      Payment Details
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Enter payment information
                    </span>
                  </div>
                </div>
                
                {/* Connecting Line */}
                {currentStep > 1 ? (
                  <div className="ml-3 h-10 w-0.5 bg-primary"></div>
                ) : (
                  <div className="ml-3 h-10 w-0.5 bg-default-200"></div>
                )}
                
                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm 
                    ${currentStep >= 2 ? "bg-primary text-white border-2 border-primary" : "border-2 border-default-200 text-default-400"}`}
                  >
                    2
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${currentStep === 2 ? "text-primary" : "text-default-700"}`}>
                      Confirmation
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Review and confirm
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Content Area */}
            <div className="w-3/4 flex flex-col">
              <div className="p-8 flex-1">
                <div className="py-4">
                  {renderStepContent()}
                </div>
              </div>
              
              {/* Footer with Navigation */}
              <div className="mt-auto p-6 bg-default-50 border-t border-divider">
                <div className="flex justify-between items-center">
                  {currentStep === 1 ? (
                    <Button
                      className={buttonStyles({
                        variant: "light",
                      })}
                      as={NextLink}
                      href="/admissions"
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      className={buttonStyles({
                        variant: "light",
                      })}
                      onClick={handlePrevious}
                    >
                      ← Previous
                    </Button>
                  )}
                  
                  <div className="flex gap-2">
                    {currentStep < totalSteps ? (
                      <Button
                        className={buttonStyles({
                          color: "primary",
                        })}
                        onClick={handleNext}
                      >
                        Next →
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className={buttonStyles({
                          color: "success",
                          variant: "shadow",
                        })}
                        onClick={handleSubmitPayment}
                        isDisabled={!formData.confirmTerms}
                      >
                        Complete Payment ✓
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Check Payment Status Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto mt-8 border border-default-200 p-6 rounded-xl bg-default-50">
        <h2 className="text-xl font-bold">Already Have a Payment Reference?</h2>
        <p className="text-default-600">
          If you've already initiated a payment and want to check its status, you can verify it using your payment reference.
        </p>
        <div className="flex justify-center">
          <Button
            as={NextLink}
            href="/admissions/payment/verify"
            className={buttonStyles({
              color: "primary",
              variant: "flat",
              size: "lg",
            })}
          >
            Verify Payment Status
          </Button>
        </div>
      </section>

      {/* Help Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold">Need Help?</h2>
        <p className="text-default-600">
          If you have any questions or need assistance with your payment,
          please don't hesitate to contact our finance office.
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
            Email Finance Office
          </Button>
        </div>
      </section>
    </div>
  );
}
