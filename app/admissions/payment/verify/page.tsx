"use client";

import { useState } from "react";
import { PaymentService, PaymentVerificationResponse } from "@/services/api";
import { title, subtitle } from "@/components/primitives";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";
import { Input } from "@heroui/input";
import { siteConfig } from "@/config/site";

interface PaymentDetails {
  ref: string;
  code: string;
  reason: string;
  academic_year_id: number;
  status: 'pending' | 'completed' | 'failed';
  paytype: string;
  amount: number;
  currency: string;
  payer_email: string;
  payer_phone: string;
  payer_name: string;
  created_at: string;
  completed_at?: string;
}

export default function VerifyPaymentPage() {
  const [invoiceRef, setInvoiceRef] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyPayment = async () => {
    if (!invoiceRef) {
      setError("Please enter an invoice reference.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Utiliser notre service API pour vérifier le paiement
      const result = await PaymentService.verifyPayment(invoiceRef);
      
      if (result.success && result.data) {
        setPaymentDetails(result.data as unknown as PaymentDetails);
      } else {
        setError(result.message || "Payment not found");
        setPaymentDetails(null);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError("Error verifying payment. Please try again.");
      setPaymentDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'pending': return 'text-warning';
      case 'failed': return 'text-danger';
      default: return 'text-default-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': 
        return <span className="bg-success-100 text-success-700 font-medium px-3 py-1 rounded-full">Completed</span>;
      case 'pending': 
        return <span className="bg-warning-100 text-warning-700 font-medium px-3 py-1 rounded-full">Pending</span>;
      case 'failed': 
        return <span className="bg-danger-100 text-danger-700 font-medium px-3 py-1 rounded-full">Failed</span>;
      default: 
        return <span className="bg-default-100 text-default-700 font-medium px-3 py-1 rounded-full">Unknown</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className={title()}>Verify Payment</h1>
        <p className={subtitle({ class: "max-w-3xl mx-auto" })}>
          Check the status of your payment by entering your invoice reference
        </p>
      </section>

      {/* Verify Payment Section */}
      <section>
        <Card className="border border-divider w-full overflow-hidden p-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-primary flex items-center mb-6">
              YALS Payment Verification
            </h2>
            
            <div className="flex gap-4">
              <Input
                isRequired
                label="Invoice Reference"
                placeholder="Enter your invoice reference (e.g. INV-123456-2025)"
                value={invoiceRef}
                onValueChange={setInvoiceRef}
                className="flex-1"
              />
              <Button
                className={buttonStyles({
                  color: "primary",
                })}
                onClick={handleVerifyPayment}
                isLoading={isLoading}
                style={{ marginTop: "auto", marginBottom: "6px" }}
              >
                Verify
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 text-danger text-sm">{error}</div>
            )}
          </div>
          
          {paymentDetails && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Payment Details</h3>
                {getStatusBadge(paymentDetails.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-default-50 p-6 rounded-lg space-y-4">
                  <h4 className="font-medium text-lg">Invoice Information</h4>
                  
                  <div>
                    <div className="text-sm text-default-500">Reference</div>
                    <div className="font-medium">{paymentDetails.ref}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-default-500">Amount</div>
                    <div className="font-medium">{paymentDetails.amount} {paymentDetails.currency}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-default-500">Payment Method</div>
                    <div className="font-medium">{paymentDetails.paytype}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-default-500">Status</div>
                    <div className={`font-medium ${getStatusColor(paymentDetails.status)}`}>
                      {paymentDetails.status.charAt(0).toUpperCase() + paymentDetails.status.slice(1)}
                    </div>
                  </div>
                </div>
                
                <div className="bg-default-50 p-6 rounded-lg space-y-4">
                  <h4 className="font-medium text-lg">Application Information</h4>
                  
                  <div>
                    <div className="text-sm text-default-500">Application Code</div>
                    <div className="font-medium">{paymentDetails.code}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-default-500">Reason</div>
                    <div className="font-medium">
                      {paymentDetails.reason === "admission" ? "Admission" : "Scolarity"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-default-500">Academic Year</div>
                    <div className="font-medium">{2024 + paymentDetails.academic_year_id}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-default-500">Payer</div>
                    <div className="font-medium">{paymentDetails.payer_name}</div>
                    <div className="text-sm">{paymentDetails.payer_email}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-default-50 p-6 rounded-lg">
                <h4 className="font-medium text-lg mb-4">Timeline</h4>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm">1</div>
                    <div>
                      <div className="font-medium">Payment Initiated</div>
                      <div className="text-sm text-default-500">{formatDate(paymentDetails.created_at)}</div>
                    </div>
                  </div>
                  
                  {paymentDetails.status === 'completed' && paymentDetails.completed_at && (
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-white text-sm">2</div>
                      <div>
                        <div className="font-medium">Payment Completed</div>
                        <div className="text-sm text-default-500">{formatDate(paymentDetails.completed_at)}</div>
                      </div>
                    </div>
                  )}
                  
                  {paymentDetails.status === 'failed' && (
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-danger flex items-center justify-center text-white text-sm">2</div>
                      <div>
                        <div className="font-medium">Payment Failed</div>
                        <div className="text-sm text-default-500">The payment could not be processed</div>
                      </div>
                    </div>
                  )}
                  
                  {paymentDetails.status === 'pending' && (
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-warning flex items-center justify-center text-white text-sm">2</div>
                      <div>
                        <div className="font-medium">Payment Pending</div>
                        <div className="text-sm text-default-500">The payment is being processed</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                {paymentDetails.status === 'pending' && (
                  <Button
                    className={buttonStyles({
                      color: "primary",
                      variant: "bordered",
                    })}
                    as={NextLink}
                    href="/admissions/payment"
                  >
                    Complete Payment
                  </Button>
                )}
                
                <Button
                  className={buttonStyles({
                    color: "primary",
                  })}
                  as={NextLink}
                  href="/admissions"
                >
                  Return to Admissions
                </Button>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* New Payment Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto mt-8 border border-default-200 p-6 rounded-xl bg-default-50">
        <h2 className="text-xl font-bold">Need to Make a New Payment?</h2>
        <p className="text-default-600">
          If you need to make a new payment for admission or scolarity fees, you can do so using our secure payment system.
        </p>
        <div className="flex justify-center">
          <Button
            as={NextLink}
            href="/admissions/payment"
            className={buttonStyles({
              color: "primary",
              variant: "flat",
              size: "lg",
            })}
          >
            Make a New Payment
          </Button>
        </div>
      </section>

      {/* Help Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold">Need Help?</h2>
        <p className="text-default-600">
          If you have any questions about your payment status,
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
