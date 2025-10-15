"use client";

import { useState, useEffect } from "react";
import { PaymentService, PaymentRequest, SchoolService, Grade, AcademicYear, MaxiCashPaymentRequest } from "@/services/api";
import { title, subtitle } from "@/components/primitives";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Progress } from "@heroui/progress";
import { siteConfig } from "@/config/site";
import { Spinner } from "@heroui/spinner";

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Updated to match the flow diagram

  // States for data fetching
  const [grades, setGrades] = useState<Grade[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [admissionFees, setAdmissionFees] = useState<{amount: number, currency_id: string} | null>(null);
  const [isLoading, setIsLoading] = useState({
    grades: false,
    academicYears: false,
    admissionFees: false,
    payment: false
  });
  
  // Selected grade and cycle
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<string>("");
  
  // État du formulaire adapté au nouveau format API et au flow
  const [formData, setFormData] = useState<PaymentRequest & { 
    confirmTerms: boolean,
    grade_id?: number,
    cycle?: string
  }>({
    code: "", // Remplace applicationReference
    reason: "admission", // Raison fixée à "admission"
    academic_year_id: 1, // Année académique par défaut
    paytype: "", // Type de paiement
    payer_email: "", // Email du payeur
    payer_phone: "", // Téléphone du payeur
    payer_name: "", // Nom du payeur (facultatif)
    confirmTerms: false, // Pour la vérification des conditions
    grade_id: undefined, // ID du grade sélectionné
    cycle: "", // Cycle sélectionné
  });

  // État pour stocker la référence de facture après paiement
  const [invoiceRef, setInvoiceRef] = useState<string | null>(null);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchGrades = async () => {
      setIsLoading(prev => ({ ...prev, grades: true }));
      try {
        const response = await SchoolService.getGrades();
        if (response.result && response.result.grades) {
          setGrades(response.result.grades);
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, grades: false }));
      }
    };
    
    const fetchAcademicYears = async () => {
      setIsLoading(prev => ({ ...prev, academicYears: true }));
      try {
        const response = await SchoolService.getAcademicYears();
        if (response.result && response.result.academic_years) {
          setAcademicYears(response.result.academic_years);
          // Set default academic year to the current one
          if (response.result.academic_years.length > 0) {
            setFormData(prev => ({
              ...prev,
              academic_year_id: response.result.academic_years[0].id
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, academicYears: false }));
      }
    };
    
    const fetchAdmissionFees = async () => {
      setIsLoading(prev => ({ ...prev, admissionFees: true }));
      try {
        const response = await SchoolService.getAdmissionFeesAmount();
        if (response.result) {
          setAdmissionFees({
            amount: response.result.amount,
            currency_id: response.result.currency_id
          });
        }
      } catch (error) {
        console.error("Error fetching admission fees:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, admissionFees: false }));
      }
    };
    
    fetchGrades();
    fetchAcademicYears();
    fetchAdmissionFees();
  }, []);

  // Gestion des changements dans le formulaire
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle grade selection
  const handleGradeSelection = (gradeId: number) => {
    const grade = grades.find(g => g.id === gradeId);
    if (grade) {
      setSelectedGrade(grade);
      setSelectedCycle(grade.cycle);
      setFormData({
        ...formData,
        grade_id: grade.id,
        cycle: grade.cycle
      });
    }
  };
  
  // Handle cycle selection
  const handleCycleSelection = (cycle: string) => {
    setSelectedCycle(cycle);
    setFormData({
      ...formData,
      cycle: cycle
    });
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Validation for each step
      switch(currentStep) {
        case 1: // Grade selection
          if (!formData.grade_id) {
            alert("Please select a grade before proceeding.");
            return;
          }
          break;
          
        case 2: // Cycle selection
          if (!formData.cycle) {
            alert("Please select a cycle before proceeding.");
            return;
          }
          break;
          
        case 3: // Payment information
          if (
            !formData.code ||
            !formData.payer_email ||
            !formData.payer_phone ||
            !formData.paytype
          ) {
            alert("Please fill in all required fields before proceeding.");
            return;
          }
          break;
      }
      
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // État pour stocker l'URL de redirection MaxiCash
  const [maxiCashRedirectUrl, setMaxiCashRedirectUrl] = useState<string | null>(null);

  const handleSubmitPayment = async () => {
    // Validation pour l'étape finale
    if (!formData.confirmTerms) {
      alert("Veuillez confirmer que toutes les informations sont correctes pour continuer.");
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, payment: true }));
      
      // Préparer les données de paiement pour notre API
      const paymentData: PaymentRequest = {
        code: formData.code,
        reason: formData.reason,
        academic_year_id: formData.academic_year_id,
        paytype: formData.paytype,
        payer_email: formData.payer_email,
        payer_phone: formData.payer_phone,
        payer_name: formData.payer_name || formData.payer_email.split("@")[0], // Utiliser la première partie de l'email si le nom n'est pas fourni
      };

      // Si le type de paiement est MaxiCash, utiliser l'API MaxiCash
      if (formData.paytype === "maxicash") {
        // Préparer les données pour MaxiCash
        const maxiCashData: MaxiCashPaymentRequest = {
          amount: admissionFees?.amount || 0,
          currency: admissionFees?.currency_id || "XAF",
          phone: formData.payer_phone,
          email: formData.payer_email,
          first_name: formData.payer_name?.split(" ")[0] || formData.payer_email.split("@")[0],
          last_name: formData.payer_name?.split(" ").slice(1).join(" ") || "",
          description: `Frais d'admission - ${selectedGrade?.name || ""} - ${formData.code}`,
          external_reference: formData.code,
          callback_url: `${window.location.origin}/api/payments/callback`,
          return_url: `${window.location.origin}/admissions/payment/verify`,
          cancel_url: `${window.location.origin}/admissions/payment`
        };

        // Initier le paiement MaxiCash
        const maxiCashResult = await PaymentService.initiateMaxiCashPayment(maxiCashData);

        if (maxiCashResult.status === "success" && maxiCashResult.data?.payment_url) {
          // Enregistrer d'abord le paiement dans notre système
          const result = await PaymentService.createPayment(paymentData);
          
          if (result.success && result.data) {
            // Sauvegarder la référence de facture pour vérification ultérieure
            setInvoiceRef(result.data.ref);
            
            // Rediriger vers la page de paiement MaxiCash
            setMaxiCashRedirectUrl(maxiCashResult.data.payment_url);
            window.location.href = maxiCashResult.data.payment_url;
          } else {
            alert(`Erreur lors de l'enregistrement du paiement: ${result.message}`);
          }
        } else {
          alert(`Erreur lors de l'initialisation du paiement MaxiCash: ${maxiCashResult.message || maxiCashResult.error}`);
        }
      } else {
        // Pour les autres types de paiement, utiliser notre API standard
        const result = await PaymentService.createPayment(paymentData);

        if (result.success && result.data) {
          // Sauvegarder la référence de facture pour vérification ultérieure
          setInvoiceRef(result.data.ref);
          // Passer à l'étape de succès (step 5)
          setCurrentStep(5);
        } else {
          alert(`Erreur lors du traitement du paiement: ${result.message}`);
        }
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Erreur lors du traitement du paiement. Veuillez réessayer.");
    } finally {
      setIsLoading(prev => ({ ...prev, payment: false }));
    }
  };

  // Composant pour la redirection vers MaxiCash
  const MaxiCashRedirectComponent = ({ url }: { url: string }) => {
    return (
      <div className="space-y-6 sm:space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4">
            <Spinner size="lg" color="white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">
            Redirection vers MaxiCash
          </h3>
          <p className="text-default-600 text-sm sm:text-base mb-6">
            Vous allez être redirigé vers la plateforme de paiement MaxiCash. Veuillez patienter...
          </p>
        </div>
        
        <div className="bg-default-50 p-4 sm:p-6 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-default-700 mb-4">
            Si vous n'êtes pas redirigé automatiquement, veuillez cliquer sur le bouton ci-dessous.
          </p>
          
          <Button
            as="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({
              color: "primary",
              variant: "shadow",
              size: "lg",
            })}
          >
            Continuer vers MaxiCash
          </Button>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    // Si nous avons une URL de redirection MaxiCash, afficher le composant de redirection
    if (maxiCashRedirectUrl) {
      return <MaxiCashRedirectComponent url={maxiCashRedirectUrl} />;
    }
    
    switch (currentStep) {
      case 1: // Grade Selection
        return (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">
                Grade Selection
              </h3>
              <p className="text-default-600 text-sm text-center mb-6 sm:mb-8">
                Please select the grade for admission
              </p>
            </div>
            
            {isLoading.grades ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" color="primary" />
                <span className="ml-2">Loading grades...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {grades.length === 0 && !isLoading.grades ? (
                  <div className="col-span-full text-center py-8 text-default-500">
                    Aucun grade disponible. Veuillez contacter l'administration.
                  </div>
                ) : (
                  grades.map((grade) => (
                    <Card 
                      key={grade.id} 
                      isPressable 
                      onPress={() => handleGradeSelection(grade.id)}
                      className={`p-4 ${formData.grade_id === grade.id ? 'border-2 border-primary' : 'border border-divider'}`}
                    >
                      <div className="flex flex-col items-center justify-center p-4">
                        <h4 className="text-xl font-bold mb-2">{grade.name}</h4>
                        <div className="mb-2 px-3 py-1 rounded-full text-xs font-medium uppercase
                          ${grade.cycle === 'maternel' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}"
                        >
                          {grade.cycle === 'maternel' ? 'Maternel' : 'Primaire'}
                        </div>
                        {formData.grade_id === grade.id && (
                          <div className="mt-2 text-primary">
                            <span>✓ Sélectionné</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        );
        
      case 2: // Cycle Selection
        return (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">
                Cycle Selection
              </h3>
              <p className="text-default-600 text-sm text-center mb-6 sm:mb-8">
                Please confirm the educational cycle
              </p>
            </div>
            
            {/* Filtrer les cycles disponibles en fonction des grades */}
            {isLoading.grades ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" color="primary" />
                <span className="ml-2">Chargement des cycles...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                {/* Vérifier si le cycle maternel est disponible */}
                {grades.some(grade => grade.cycle === "maternel") && (
                  <Card 
                    isPressable 
                    onPress={() => handleCycleSelection("maternel")}
                    className={`p-4 ${selectedCycle === "maternel" ? 'border-2 border-primary' : 'border border-divider'}`}
                  >
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <span className="text-blue-700 text-xl">M</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Maternel</h4>
                      <p className="text-default-600 text-center">Éducation préscolaire pour les enfants de 3 à 5 ans</p>
                      {selectedCycle === "maternel" && (
                        <div className="mt-3 text-primary">
                          <span>✓ Sélectionné</span>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
                
                {/* Vérifier si le cycle primaire est disponible */}
                {grades.some(grade => grade.cycle === "primary") && (
                  <Card 
                    isPressable 
                    onPress={() => handleCycleSelection("primary")}
                    className={`p-4 ${selectedCycle === "primary" ? 'border-2 border-primary' : 'border border-divider'}`}
                  >
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                        <span className="text-green-700 text-xl">P</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Primaire</h4>
                      <p className="text-default-600 text-center">Éducation primaire pour les enfants de 6 à 12 ans</p>
                      {selectedCycle === "primary" && (
                        <div className="mt-3 text-primary">
                          <span>✓ Sélectionné</span>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
                
                {/* Message si aucun cycle n'est disponible */}
                {!grades.some(grade => grade.cycle === "maternel" || grade.cycle === "primary") && (
                  <div className="col-span-full text-center py-8 text-default-500">
                    Aucun cycle disponible. Veuillez contacter l'administration.
                  </div>
                )}
              </div>
            )}
            
            {selectedGrade && (
              <div className="bg-default-50 p-4 rounded-lg mt-6 text-center">
                <p className="text-default-600">Selected Grade: <span className="font-bold">{selectedGrade.name}</span></p>
              </div>
            )}
          </div>
        );
        
      case 3: // Payment Information
        return (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">
                Payment Information
              </h3>
              <p className="text-default-600 text-sm text-center mb-6 sm:mb-8">
                Enter your payment details
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="col-span-1">
                <Input
                  isRequired
                  label="Code de référence *"
                  placeholder="Entrez le code de référence"
                  value={formData.code}
                  onValueChange={(value) => handleInputChange("code", value)}
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                />
              </div>

              <div className="col-span-1">
                <Select
                  isRequired
                  label="Année académique *"
                  placeholder="Sélectionnez une année académique"
                  selectedKeys={formData.academic_year_id ? [formData.academic_year_id.toString()] : []}
                  onSelectionChange={(keys) =>
                    handleInputChange("academic_year_id", parseInt(Array.from(keys)[0] as string))
                  }
                  size="sm"
                  isLoading={isLoading.academicYears}
                  classNames={{
                    label: "text-small",
                  }}
                >
                  {academicYears.map((year) => (
                    <SelectItem key={year.id.toString()}>
                      {year.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="col-span-1">
                <Input
                  isRequired
                  type="email"
                  label="Email du payeur *"
                  placeholder="Entrez l'adresse email"
                  value={formData.payer_email}
                  onValueChange={(value) =>
                    handleInputChange("payer_email", value)
                  }
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                />
              </div>

              <div className="col-span-1">
                <Input
                  isRequired
                  type="tel"
                  label="Téléphone du payeur *"
                  placeholder="+243 123 456 789"
                  value={formData.payer_phone}
                  onValueChange={(value) =>
                    handleInputChange("payer_phone", value)
                  }
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                />
              </div>
              
              <div className="col-span-1">
                <Input
                  label="Nom du payeur (optionnel)"
                  placeholder="Entrez le nom du payeur"
                  value={formData.payer_name || ""}
                  onValueChange={(value) =>
                    handleInputChange("payer_name", value)
                  }
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                />
              </div>

              <div className="col-span-1">
                <Select
                  isRequired
                  label="Méthode de paiement *"
                  placeholder="Sélectionnez une méthode"
                  selectedKeys={formData.paytype ? [formData.paytype] : []}
                  onSelectionChange={(keys) =>
                    handleInputChange("paytype", Array.from(keys)[0] as string)
                  }
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                >
                  <SelectItem key="maxicash">MaxiCash</SelectItem>
                  <SelectItem key="bank_transfer">Virement bancaire</SelectItem>
                  <SelectItem key="mobile_money">Mobile Money</SelectItem>
                </Select>
              </div>
            </div>
            
            {/* Display selected grade and cycle */}
            <div className="bg-default-50 p-4 rounded-lg">
              <h4 className="text-base font-medium mb-2">Options sélectionnées</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-default-500">Grade:</span>
                  <span className="font-medium text-base">{selectedGrade?.name}</span>
                  <div className="mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium
                    ${selectedCycle === 'maternel' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}"
                  >
                    {selectedCycle === 'maternel' ? 'Maternel' : 'Primaire'}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-default-500">Année académique:</span>
                  <span className="font-medium text-base">
                    {academicYears.find(y => y.id === formData.academic_year_id)?.name || "Non sélectionnée"}
                  </span>
                  <span className="text-xs text-default-400">
                    {academicYears.find(y => y.id === formData.academic_year_id)?.start_date && 
                     `${academicYears.find(y => y.id === formData.academic_year_id)?.start_date} - 
                      ${academicYears.find(y => y.id === formData.academic_year_id)?.end_date}`}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Display admission fees if available */}
            <div className="bg-primary-50 p-4 rounded-lg">
              <h4 className="text-base font-medium mb-3">Frais d'admission</h4>
              
              {isLoading.admissionFees ? (
                <div className="flex justify-center items-center py-2">
                  <Spinner size="sm" color="primary" />
                  <span className="ml-2 text-sm">Chargement des frais...</span>
                </div>
              ) : admissionFees ? (
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <p className="text-sm text-default-600 mb-1">Montant à payer:</p>
                    <p className="text-2xl font-bold text-primary-700">
                      {admissionFees.amount} {admissionFees.currency_id}
                    </p>
                  </div>
                  
                  <div className="mt-3 sm:mt-0 bg-primary-100 px-4 py-2 rounded-lg">
                    <p className="text-xs text-primary-700">Ces frais sont non-remboursables et doivent être payés pour finaliser l'admission.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-default-500">
                  Impossible de récupérer les frais d'admission. Veuillez réessayer plus tard.
                </div>
              )}
            </div>
          </div>
        );
        
      case 4: // Payment Confirmation
        return (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">
                Confirmation du paiement
              </h3>
              <p className="text-default-600 text-sm text-center mb-6 sm:mb-8">
                Vérifiez vos informations avant de finaliser le paiement
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-default-50 p-4 sm:p-6 rounded-lg">
                <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                  Détails de l'admission
                </h4>
                <div className="flex flex-col sm:flex-row border-b border-divider py-2 sm:py-3">
                  <span className="font-medium sm:w-1/3">
                    Code de référence:
                  </span>
                  <span className="text-default-700 font-mono">{formData.code}</span>
                </div>
                <div className="flex flex-col sm:flex-row border-b border-divider py-2 sm:py-3">
                  <span className="font-medium sm:w-1/3">Raison du paiement:</span>
                  <span className="text-default-700">
                    {formData.reason === "admission" ? "Frais d'admission" : "Frais de scolarité"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row border-b border-divider py-2 sm:py-3">
                  <span className="font-medium sm:w-1/3">Grade:</span>
                  <div className="flex items-center">
                    <span className="text-default-700 mr-2">
                      {selectedGrade?.name}
                    </span>
                    <div className="inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${selectedCycle === 'maternel' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}"
                    >
                      {selectedCycle === 'maternel' ? 'Maternel' : 'Primaire'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row py-2 sm:py-3">
                  <span className="font-medium sm:w-1/3">Année académique:</span>
                  <div className="flex flex-col">
                    <span className="text-default-700">
                      {academicYears.find(y => y.id === formData.academic_year_id)?.name || `Année ${formData.academic_year_id}`}
                    </span>
                    <span className="text-xs text-default-500">
                      {academicYears.find(y => y.id === formData.academic_year_id)?.start_date && 
                        `Du ${academicYears.find(y => y.id === formData.academic_year_id)?.start_date} au 
                        ${academicYears.find(y => y.id === formData.academic_year_id)?.end_date}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-default-50 p-4 sm:p-6 rounded-lg">
                <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                  Informations du payeur
                </h4>
                <div className="flex flex-col sm:flex-row border-b border-divider py-2 sm:py-3">
                  <span className="font-medium sm:w-1/3">Nom:</span>
                  <span className="text-default-700">
                    {formData.payer_name || formData.payer_email.split("@")[0]}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row border-b border-divider py-2 sm:py-3">
                  <span className="font-medium sm:w-1/3">Email:</span>
                  <span className="text-default-700 break-words">
                    {formData.payer_email}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row border-b border-divider py-2 sm:py-3">
                  <span className="font-medium sm:w-1/3">Téléphone:</span>
                  <span className="text-default-700">
                    {formData.payer_phone}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row py-2 sm:py-3">
                  <span className="font-medium sm:w-1/3">Méthode de paiement:</span>
                  <span className="text-default-700 capitalize">
                    {formData.paytype === "maxicash" ? "MaxiCash" : 
                     formData.paytype === "bank_transfer" ? "Virement bancaire" : 
                     formData.paytype === "mobile_money" ? "Mobile Money" : 
                     formData.paytype.replace("_", " ")}
                  </span>
                </div>
              </div>
              
              {admissionFees && (
                <div className="bg-success-50 p-4 sm:p-6 rounded-lg">
                  <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-success-700">
                    Montant à payer
                  </h4>
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="text-3xl font-bold text-success-700">
                      {admissionFees.amount} {admissionFees.currency_id}
                    </div>
                    <div className="mt-3 sm:mt-0 text-sm text-success-600">
                      Paiement unique pour l'admission
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start sm:items-center gap-2 bg-primary-50 p-3 sm:p-4 rounded-lg">
                <Checkbox
                  isSelected={formData.confirmTerms}
                  onValueChange={(value) =>
                    handleInputChange("confirmTerms", value)
                  }
                  size="sm"
                />
                <span className="text-xs sm:text-sm text-primary-800">
                  Je confirme que toutes les informations fournies sont correctes et j'accepte
                  les conditions générales de paiement.
                </span>
              </div>
            </div>
          </div>
        );
        
      case 5: // Payment Success
        return (
          <div className="space-y-6 sm:space-y-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mb-4">
                <span className="text-white text-3xl">✓</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                Paiement réussi !
              </h3>
              <p className="text-default-600 text-sm sm:text-base mb-6">
                Votre paiement a été traité avec succès
              </p>
            </div>
            
            <div className="bg-default-50 p-4 sm:p-6 rounded-lg max-w-md mx-auto">
              <h4 className="text-base font-medium mb-4">Détails du paiement</h4>
              
              <div className="flex flex-col gap-2 text-left">
                <div className="flex justify-between border-b border-divider py-2">
                  <span className="text-default-600">Référence:</span>
                  <span className="font-medium font-mono">{invoiceRef}</span>
                </div>
                
                <div className="flex justify-between border-b border-divider py-2">
                  <span className="text-default-600">Grade:</span>
                  <span className="font-medium">
                    {selectedGrade?.name} <span className="text-xs ml-1 px-2 py-0.5 rounded-full ${selectedCycle === 'maternel' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">{selectedCycle === 'maternel' ? 'Maternel' : 'Primaire'}</span>
                  </span>
                </div>
                
                <div className="flex justify-between border-b border-divider py-2">
                  <span className="text-default-600">Montant:</span>
                  <span className="font-medium text-success-600">
                    {admissionFees ? `${admissionFees.amount} ${admissionFees.currency_id}` : "--"}
                  </span>
                </div>
                
                <div className="flex justify-between border-b border-divider py-2">
                  <span className="text-default-600">Statut:</span>
                  <span className="font-medium text-success-600">Complété</span>
                </div>
                
                <div className="flex justify-between border-b border-divider py-2">
                  <span className="text-default-600">Méthode de paiement:</span>
                  <span className="font-medium">
                    {formData.paytype === "maxicash" ? "MaxiCash" : 
                     formData.paytype === "bank_transfer" ? "Virement bancaire" : 
                     formData.paytype === "mobile_money" ? "Mobile Money" : 
                     formData.paytype.replace("_", " ")}
                  </span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-default-600">Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-success-50 p-4 rounded-lg max-w-md mx-auto mt-4">
              <p className="text-sm text-success-700">
                Un email de confirmation a été envoyé à <strong>{formData.payer_email}</strong>. 
                Veuillez conserver cette référence pour toute communication future.
              </p>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                as={NextLink}
                href="/admissions"
                className={buttonStyles({
                  color: "primary",
                  variant: "flat",
                  size: "lg",
                })}
              >
                Retour aux admissions
              </Button>
              
              <Button
                as={NextLink}
                href="/admissions/payment/verify"
                className={buttonStyles({
                  variant: "bordered",
                  size: "lg",
                })}
              >
                Vérifier le statut
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 py-4 sm:py-6 md:py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <section className="text-center space-y-3 sm:space-y-4">
        <h1 className={title({ class: "text-3xl sm:text-4xl md:text-5xl" })}>
          YALS Payment
        </h1>
        <p
          className={subtitle({
            class: "max-w-3xl mx-auto text-sm sm:text-base",
          })}
        >
          Complete your admission process by making a payment
        </p>
      </section>

      {/* Payment Form - New Layout */}
      <section>
        <Card className="border border-divider w-full overflow-hidden">
          {/* Responsive Layout Container */}
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar with Steps - Hidden on small screens, shown at top as horizontal steps */}
            <div className="hidden md:block md:w-1/4 md:min-w-[200px] lg:min-w-[250px] border-r border-divider bg-content1 py-8 px-4">
              <div className="mb-8">
                <h2 className="text-lg font-bold text-primary flex items-center">
                  YALS
                </h2>
              </div>

              {/* Vertical Progress Steps - Only visible on md and larger screens */}
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
                    <span
                      className={`text-sm font-medium ${currentStep === 1 ? "text-primary" : "text-default-700"}`}
                    >
                      Grade Selection
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Choose your grade
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
                    {currentStep > 2 ? "✓" : "2"}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium ${currentStep === 2 ? "text-primary" : "text-default-700"}`}
                    >
                      Cycle Selection
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Confirm education cycle
                    </span>
                  </div>
                </div>
                
                {/* Connecting Line */}
                {currentStep > 2 ? (
                  <div className="ml-3 h-10 w-0.5 bg-primary"></div>
                ) : (
                  <div className="ml-3 h-10 w-0.5 bg-default-200"></div>
                )}
                
                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm 
                    ${currentStep >= 3 ? "bg-primary text-white border-2 border-primary" : "border-2 border-default-200 text-default-400"}`}
                  >
                    {currentStep > 3 ? "✓" : "3"}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium ${currentStep === 3 ? "text-primary" : "text-default-700"}`}
                    >
                      Payment Details
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Enter payment information
                    </span>
                  </div>
                </div>
                
                {/* Connecting Line */}
                {currentStep > 3 ? (
                  <div className="ml-3 h-10 w-0.5 bg-primary"></div>
                ) : (
                  <div className="ml-3 h-10 w-0.5 bg-default-200"></div>
                )}
                
                {/* Step 4 */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm 
                    ${currentStep >= 4 ? "bg-primary text-white border-2 border-primary" : "border-2 border-default-200 text-default-400"}`}
                  >
                    {currentStep > 4 ? "✓" : "4"}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium ${currentStep === 4 ? "text-primary" : "text-default-700"}`}
                    >
                      Confirmation
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Review and confirm
                    </span>
                  </div>
                </div>
                
                {/* Connecting Line */}
                {currentStep > 4 ? (
                  <div className="ml-3 h-10 w-0.5 bg-primary"></div>
                ) : (
                  <div className="ml-3 h-10 w-0.5 bg-default-200"></div>
                )}
                
                {/* Step 5 */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm 
                    ${currentStep >= 5 ? "bg-success text-white border-2 border-success" : "border-2 border-default-200 text-default-400"}`}
                  >
                    5
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium ${currentStep === 5 ? "text-success" : "text-default-700"}`}
                    >
                      Complete
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Payment processed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Progress Indicator - Only visible on small screens */}
            <div className="block md:hidden w-full bg-content1 p-4 border-b border-divider">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-primary">YALS</h2>
                <span className="text-sm text-default-500">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>

              {/* Import Progress from @heroui/progress at the top of the file */}
              <div className="h-2 w-full bg-default-200 rounded-full mb-4">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>

              {/* Current Step Title */}
              <h3 className="text-sm font-medium text-center">
                {currentStep === 1 && "Grade Selection"}
                {currentStep === 2 && "Cycle Selection"}
                {currentStep === 3 && "Payment Details"}
                {currentStep === 4 && "Confirmation"}
                {currentStep === 5 && "Payment Complete"}
              </h3>
            </div>

            {/* Right Content Area */}
            <div className="w-full md:w-3/4 flex flex-col">
              <div className="p-4 sm:p-6 md:p-8 flex-1">
                <div className="py-2 sm:py-4">{renderStepContent()}</div>
              </div>

              {/* Footer with Navigation */}
              <div className="mt-auto p-4 sm:p-6 bg-default-50 border-t border-divider">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  {currentStep === 1 ? (
                    <Button
                      className={buttonStyles({
                        variant: "light",
                        fullWidth: true,
                        class: "sm:w-auto",
                      })}
                      as={NextLink}
                      href="/admissions"
                    >
                      Cancel
                    </Button>
                  ) : currentStep === 5 ? (
                    <Button
                      className={buttonStyles({
                        variant: "light",
                        fullWidth: true,
                        class: "sm:w-auto",
                      })}
                      as={NextLink}
                      href="/admissions"
                    >
                      Back to Admissions
                    </Button>
                  ) : (
                    <Button
                      className={buttonStyles({
                        variant: "light",
                        fullWidth: true,
                        class: "sm:w-auto",
                      })}
                      onClick={handlePrevious}
                    >
                      ← Previous
                    </Button>
                  )}

                  <div className="flex gap-2 w-full sm:w-auto">
                    {currentStep < 4 ? (
                      <Button
                        className={buttonStyles({
                          color: "primary",
                          fullWidth: true,
                          class: "sm:w-auto",
                        })}
                        onClick={handleNext}
                      >
                        Next →
                      </Button>
                    ) : currentStep === 4 ? (
                      <Button
                        type="button"
                        className={buttonStyles({
                          color: "success",
                          variant: "shadow",
                          fullWidth: true,
                          class: "sm:w-auto",
                        })}
                        onClick={handleSubmitPayment}
                        isDisabled={!formData.confirmTerms || isLoading.payment}
                        isLoading={isLoading.payment}
                      >
                        {isLoading.payment ? "Traitement en cours..." : "Finaliser le paiement ✓"}
                      </Button>
                    ) : (
                      <Button
                        as={NextLink}
                        href="/admissions/payment/verify"
                        className={buttonStyles({
                          color: "primary",
                          variant: "flat",
                          fullWidth: true,
                          class: "sm:w-auto",
                        })}
                      >
                        Verify Payment Status
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
      <section className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto mt-6 sm:mt-8 border border-default-200 p-4 sm:p-6 rounded-xl bg-default-50">
        <h2 className="text-lg sm:text-xl font-bold">
          Already Have a Payment Reference?
        </h2>
        <p className="text-default-600 text-sm sm:text-base px-2">
          If you've already initiated a payment and want to check its status,
          you can verify it using your payment reference.
        </p>
        <div className="flex justify-center">
          <Button
            as={NextLink}
            href="/admissions/payment/verify"
            className={buttonStyles({
              color: "primary",
              variant: "flat",
              size: "md",
              class: "px-3 py-1 sm:px-6 sm:py-2",
            })}
          >
            Verify Payment Status
          </Button>
        </div>
      </section>

      {/* Help Section */}
      <section className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-bold">Need Help?</h2>
        <p className="text-default-600 text-sm sm:text-base px-2">
          If you have any questions or need assistance with your payment, please
          don't hesitate to contact our finance office.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <Button
            as={NextLink}
            href="/contact"
            className={buttonStyles({
              variant: "bordered",
              radius: "full",
              fullWidth: true,
              class: "sm:w-auto",
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
              fullWidth: true,
              class: "sm:w-auto",
            })}
          >
            Email Finance Office
          </Button>
        </div>
      </section>
    </div>
  );
}
