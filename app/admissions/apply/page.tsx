"use client";

import { useState, useMemo, useEffect } from "react";
import { SchoolService, Grade, AcademicYear } from "@/services/api";
import { title, subtitle } from "@/components/primitives";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";
import NextLink from "next/link";
import { Progress } from "@heroui/progress";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { RadioGroup, Radio } from "@heroui/radio";
// import { DatePicker } from "@heroui/date-picker";
// import { useForm } from "@heroui/form";

import { siteConfig } from "@/config/site";

export default function ApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // États pour les données des API
  const [grades, setGrades] = useState<Grade[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState({
    grades: false,
    academicYears: false
  });
  
  // Récupération des données des API
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
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, academicYears: false }));
      }
    };
    
    fetchGrades();
    fetchAcademicYears();
  }, []);

  // État du formulaire
  const [formData, setFormData] = useState({
    // Étape 1: Informations de l'étudiant
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    chosenName: "",
    gender: "",
    dateOfBirth: "",
    placeOfBirth: "",
    nationality: "",
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    email: "",
    gradeApplying: "",
    academicYear: "",
    siblings: [{ name: "", grade: "" }] as Array<{
      name: string;
      grade: string;
    }>,

    // Background Information
    backgroundInfo: {
      nationality: "",
      languagesSpokenAtHome: "",
      residentialAddress: "",
      studentLivesWith: "",
      learningSupport: false,
    },

    // Étape 2: Parents/Tuteurs
    parent1: {
      fullName: "",
      relationship: "",
      occupation: "",
      employer: "",
      workPhone: "",
      mobilePhone: "",
      email: "",
      preferredLanguage: "",
      address: "same", // "same" ou "different"
      differentAddress: "",
      differentCity: "",
      differentPostalCode: "",
    },
    parent2: {
      firstName: "",
      lastName: "",
      relationship: "",
      occupation: "",
      employer: "",
      workPhone: "",
      mobilePhone: "",
      email: "",
      address: "same", // "same" ou "different"
      differentAddress: "",
      differentCity: "",
      differentPostalCode: "",
    },
    hasSecondParent: false,
    
    // Authorized Pickup Contacts
    authorizedPickupContacts: [
      {
        name: "",
        cellPhone: "",
        relationship: "",
      },
    ] as Array<{
      name: string;
      cellPhone: string;
      relationship: string;
    }>,
    
    // Emergency Contact
    emergencyContact: {
      fullName: "",
      relationship: "",
      mobilePhone: "",
    },

    // Étape 3: Santé et éducation
    healthInfo: {
      allergies: false,
      chronicIllness: false,
      regularMedication: false,
      specificMedicalConditions: {
        asthma: false,
        severeAllergies: false,
        diabetes: false,
        seizures: false,
        other: false,
      },
      doctorName: "",
      doctorPhone: "",
      modeOfTransport: "",
    },
    educationHistory: [
      {
        schoolName: "",
        reasonForLeaving: "",
      },
    ] as Array<{
      schoolName: string;
      reasonForLeaving: string;
    }>,

    // Étape 4: Documents et consentements
    mediaRelease: "",
    feeAcceptance: "",
    medicalAuthorization: false,
    documents: {
      passportPhotos: {
        checked: false,
        file: null as string | null,
        fileName: "",
      },
      schoolReport: {
        checked: false,
        file: null as string | null,
        fileName: "",
      },
      parentId: {
        checked: false,
        file: null as string | null,
        fileName: "",
      },
      studentId: {
        checked: false,
        file: null as string | null,
        fileName: "",
      },
    },
    consentForm: false,
    digitalSignature: "",
    identificationDocuments: false,
  });

  // Gestion des changements dans le formulaire
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Fonction pour gérer les fichiers
  const handleFileUpload = (documentType: keyof typeof formData.documents, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData({
        ...formData,
        documents: {
          ...formData.documents,
          [documentType]: {
            ...formData.documents[documentType],
            file: base64,
            fileName: file.name,
            checked: true, // Auto-check when file is uploaded
          },
        },
      });
    };
    reader.readAsDataURL(file);
  };

  // Fonction pour supprimer un fichier
  const handleFileRemove = (documentType: keyof typeof formData.documents) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [documentType]: {
          ...formData.documents[documentType],
          file: null,
          fileName: "",
          checked: false,
        },
      },
    });
  };

  // Function to transform form data to API format
  const transformFormDataToAPI = () => {
    // Filter out empty siblings
    const validSiblings = formData.siblings.filter(
      (sibling) => sibling.name.trim() !== "" && sibling.grade !== ""
    );

    // Filter out empty authorized pickup contacts
    const validPickupContacts = formData.authorizedPickupContacts.filter(
      (contact) => contact.name.trim() !== "" && contact.cellPhone.trim() !== "" && contact.relationship.trim() !== ""
    );

    // Build guardians array
    const guardians = [];
    
    // Add primary guardian
    if (formData.parent1.fullName) {
      guardians.push({
        full_name: formData.parent1.fullName,
        relationship: formData.parent1.relationship,
        phone_mobile: formData.parent1.mobilePhone,
        phone_home: formData.parent1.mobilePhone, // Using mobile as home for now
        phone_work: formData.parent1.workPhone || formData.parent1.mobilePhone,
        physical_address: formData.parent1.address === "same" 
          ? formData.backgroundInfo.residentialAddress 
          : formData.parent1.differentAddress,
        email: formData.parent1.email,
        lives_with_student: true, // Assuming primary guardian lives with student
        authorized_pickup: true, // Assuming primary guardian is authorized for pickup
        preferred_language: formData.parent1.preferredLanguage === "english" ? "en" : "fr"
      });
    }

    // Add second guardian if exists
    if (formData.hasSecondParent && formData.parent2.firstName && formData.parent2.lastName) {
      guardians.push({
        full_name: `${formData.parent2.firstName} ${formData.parent2.lastName}`,
        relationship: formData.parent2.relationship,
        phone_mobile: formData.parent2.mobilePhone || "",
        phone_home: formData.parent2.mobilePhone || "",
        phone_work: formData.parent2.workPhone || formData.parent2.mobilePhone || "",
        physical_address: formData.backgroundInfo.residentialAddress, // Assuming same address
        email: formData.parent2.email || "",
        lives_with_student: false, // Assuming second guardian doesn't live with student
        authorized_pickup: false, // Assuming second guardian is not authorized for pickup by default
        preferred_language: "en" // Default to English
      });
    }

    // Build authorized pickups array
    const authorizedPickups = validPickupContacts.map(contact => ({
      full_name: contact.name,
      relationship: contact.relationship,
      phone_mobile: contact.cellPhone
    }));

    // Build medical conditions array
    const specificMedicalConditions = [];
    if (formData.healthInfo.specificMedicalConditions.asthma) {
      specificMedicalConditions.push({
        name: "Asthme",
        description: "Maladie respiratoire chronique"
      });
    }
    if (formData.healthInfo.specificMedicalConditions.diabetes) {
      specificMedicalConditions.push({
        name: "Diabète",
        description: "Taux élevé de glucose"
      });
    }
    if (formData.healthInfo.specificMedicalConditions.severeAllergies) {
      specificMedicalConditions.push({
        name: "Allergies sévères",
        description: "Allergies nécessitant une attention médicale"
      });
    }
    if (formData.healthInfo.specificMedicalConditions.seizures) {
      specificMedicalConditions.push({
        name: "Convulsions",
        description: "Troubles convulsifs"
      });
    }
    if (formData.healthInfo.specificMedicalConditions.other) {
      specificMedicalConditions.push({
        name: "Autre condition",
        description: "Autre condition médicale spécifique"
      });
    }

    // Build schools array
    const schools = formData.educationHistory
      .filter(school => school.schoolName.trim() !== "")
      .map(school => ({
        name: school.schoolName,
        reason_for_leaving: school.reasonForLeaving || ""
      }));

    return {
      student: {
        name: formData.firstName,
        middle_name: formData.middleName || "",
        last_name: formData.lastName,
        suffix: formData.suffix || "",
        chosen_name: formData.chosenName || "",
        gender: formData.gender,
        birth_date: formData.dateOfBirth,
        requested_class_id: parseInt(formData.gradeApplying) || 1, // Utilise directement l'ID du grade de l'API
        birth_place: formData.placeOfBirth,
        nationality: formData.nationality,
        languages_spoken: formData.backgroundInfo.languagesSpokenAtHome,
        residential_address: formData.backgroundInfo.residentialAddress,
        lives_with: formData.backgroundInfo.studentLivesWith.replace('-', '_'),
        has_learning_support_needs: formData.backgroundInfo.learningSupport,
        learning_support_details: formData.backgroundInfo.learningSupport ? "Learning support needed" : "",
        academic_year_id: parseInt(formData.academicYear) // Utilise directement l'ID de l'année académique de l'API
      },
      guardians: guardians,
      authorized_pickups: authorizedPickups,
      emergency: {
        full_name: formData.emergencyContact.fullName,
        relationship: formData.emergencyContact.relationship.replace('-', '_'),
        phone_mobile: formData.emergencyContact.mobilePhone
      },
      siblings: validSiblings,
      medical: {
        has_allergies: formData.healthInfo.allergies,
        allergies: formData.healthInfo.allergies ? "Allergies present" : "",
        has_chronic_illness: formData.healthInfo.chronicIllness,
        chronic_illness: formData.healthInfo.chronicIllness ? "Chronic illness present" : "",
        takes_medication: formData.healthInfo.regularMedication,
        medications: formData.healthInfo.regularMedication ? "Takes regular medication" : "",
        doctor_name: formData.healthInfo.doctorName || "",
        doctor_phone: formData.healthInfo.doctorPhone || "",
        transport_mode: formData.healthInfo.modeOfTransport || "walk",
        specific_medical_conditions: specificMedicalConditions
      },
      schools: schools,
      documents: {
        medical_authorization: formData.medicalAuthorization,
        media_release: formData.mediaRelease === "yes",
        fee_acceptance: formData.feeAcceptance === "yes",
        consent_agreement: formData.consentForm,
        has_passport_photos_file: formData.documents.passportPhotos.checked,
        passport_photos_file: formData.documents.passportPhotos.file || "",
        has_school_records_file: formData.documents.schoolReport.checked,
        school_records_file: formData.documents.schoolReport.file || "",
        has_parent_id_copy_file: formData.documents.parentId.checked,
        parent_id_copy_file: formData.documents.parentId.file || "",
        has_student_id_copy_file: formData.documents.studentId.checked,
        student_id_copy_file: formData.documents.studentId.file || "",
        has_authorized_signature: formData.digitalSignature !== "",
        authorized_signature: formData.digitalSignature || "",
        has_other: false,
        other: ""
      }
    };
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Validation basique pour chaque étape
      let canProceed = true;

      if (currentStep === 1) {
        // Vérifier les champs requis pour l'étape 1
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.gender ||
          !formData.dateOfBirth ||
          !formData.placeOfBirth ||
          !formData.nationality ||
          // !formData.address ||
          // !formData.city ||
          !formData.gradeApplying ||
          !formData.academicYear ||
          !formData.backgroundInfo.nationality ||
          !formData.backgroundInfo.languagesSpokenAtHome ||
          !formData.backgroundInfo.residentialAddress ||
          !formData.backgroundInfo.studentLivesWith
        ) {
          alert("Please fill in all required fields before proceeding.");
          canProceed = false;
        }

        // Vérifier les informations des frères et sœurs si des données sont saisies
        const hasFilledSiblings = formData.siblings.some(
          (sibling) => sibling.name.trim() !== "" || sibling.grade !== ""
        );

        if (hasFilledSiblings) {
          const incompleteSibling = formData.siblings.find(
            (sibling) =>
              (sibling.name.trim() !== "" && !sibling.grade) ||
              (sibling.grade && !sibling.name.trim())
          );
          if (incompleteSibling) {
            alert(
              "Please complete all sibling information (both name and grade are required)."
            );
            canProceed = false;
          }
        }
      } else if (currentStep === 2) {
        // Vérifier les champs requis pour l'étape 2
        const parent1 = formData.parent1;
        if (
          !parent1.fullName ||
          !parent1.relationship ||
          !parent1.preferredLanguage ||
          !parent1.mobilePhone ||
          !parent1.email
        ) {
          alert(
            "Please fill in all required fields for the primary parent/guardian."
          );
          canProceed = false;
        }

        // Vérifier le parent 2 si indiqué
        if (formData.hasSecondParent) {
          const parent2 = formData.parent2;
          if (
            !parent2.firstName ||
            !parent2.lastName ||
            !parent2.relationship
          ) {
            alert(
              "Please complete the second parent/guardian information or uncheck the option."
            );
            canProceed = false;
          }
        }

        // Vérifier les contacts autorisés pour le pickup
        const hasFilledPickupContacts = formData.authorizedPickupContacts.some(
          (contact) => contact.name.trim() !== "" || contact.cellPhone.trim() !== "" || contact.relationship.trim() !== ""
        );
        
        if (hasFilledPickupContacts) {
          const incompletePickupContact = formData.authorizedPickupContacts.find(
            (contact) =>
              (contact.name.trim() !== "" && (!contact.cellPhone.trim() || !contact.relationship.trim())) ||
              (contact.cellPhone.trim() !== "" && (!contact.name.trim() || !contact.relationship.trim())) ||
              (contact.relationship.trim() !== "" && (!contact.name.trim() || !contact.cellPhone.trim()))
          );
          if (incompletePickupContact) {
            alert("Please complete all authorized pickup contact information (name, phone, and relationship are required).");
            canProceed = false;
          }
        }

        // Vérifier le contact d'urgence
        const emergency = formData.emergencyContact;
        if (
          !emergency.fullName ||
          !emergency.relationship ||
          !emergency.mobilePhone
        ) {
          alert(
            "Please fill in all required fields for the emergency contact."
          );
          canProceed = false;
        }
      }

      if (canProceed) {
        setCurrentStep(currentStep + 1);
      }
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
          <div className="space-y-6 sm:space-y-8">
            {/* Informations académiques */}
            <div>
              <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Academic Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Select
                  isRequired
                  label="Grade Applying For"
                  placeholder="Select grade"
                  selectedKeys={
                    formData.gradeApplying ? [formData.gradeApplying] : []
                  }
                  onSelectionChange={(keys) => {
                    const gradeKey = Array.from(keys)[0] as string;
                    handleInputChange("gradeApplying", gradeKey);
                    
                    // Mettre à jour le cycle automatiquement
                    const selectedGrade = grades.find(g => g.id.toString() === gradeKey);
                    if (selectedGrade) {
                      // Vous pouvez stocker le cycle dans le formData si nécessaire
                      // handleInputChange("cycle", selectedGrade.cycle);
                    }
                  }}
                  size="sm"
                  isLoading={isLoading.grades}
                  classNames={{
                    label: "text-small",
                  }}
                >
                  {grades.length === 0 ? (
                    <SelectItem key="loading">No grades available</SelectItem>
                  ) : (
                    grades.map((grade) => (
                      <SelectItem key={grade.id.toString()}>
                        {grade.name} ({grade.cycle === "maternel" ? "Maternel" : "Primary"})
                      </SelectItem>
                    ))
                  )}
                </Select>
                
                <Select
                  isRequired
                  label="Academic Year"
                  placeholder="Select academic year"
                  selectedKeys={
                    formData.academicYear ? [formData.academicYear] : []
                  }
                  onSelectionChange={(keys) =>
                    handleInputChange("academicYear", Array.from(keys)[0] as string)
                  }
                  size="sm"
                  isLoading={isLoading.academicYears}
                  classNames={{
                    label: "text-small",
                  }}
                >
                  {academicYears.length === 0 ? (
                    <SelectItem key="loading">No academic years available</SelectItem>
                  ) : (
                    academicYears.map((year) => (
                      <SelectItem key={year.id.toString()}>
                        {year.name}
                      </SelectItem>
                    ))
                  )}
                </Select>
              </div>
            </div>
            
            <Divider className="my-2 sm:my-4" />
            
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">Student Information</h3>
              <p className="text-default-600 text-sm mt-1">
                In this section, you'll provide basic information about the
                student applying for admission.
              </p>
            </div>

            {/* Formulaire d'informations personnelles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <Input
                isRequired
                label="First Name"
                placeholder="Enter student's first name"
                value={formData.firstName}
                onValueChange={(value) => handleInputChange("firstName", value)}
                size="sm"
                classNames={{
                  label: "text-small",
                }}
              />

              <Input
                label="Middle Name (if applicable)"
                placeholder="Enter student's middle name"
                value={formData.middleName}
                onValueChange={(value) =>
                  handleInputChange("middleName", value)
                }
                size="sm"
                classNames={{
                  label: "text-small",
                }}
              />

              <Input
                isRequired
                label="Last Name"
                placeholder="Enter student's last name"
                value={formData.lastName}
                onValueChange={(value) => handleInputChange("lastName", value)}
                size="sm"
                classNames={{
                  label: "text-small",
                }}
              />

              <Input
                label="Suffix (if applicable)"
                placeholder="Jr, Sr, II, III, IV, V"
                value={formData.suffix}
                onValueChange={(value) => handleInputChange("suffix", value)}
                size="sm"
                classNames={{
                  label: "text-small",
                }}
              />

              <Input
                label="Chosen Name (if applicable)"
                placeholder="Preferred name or nickname"
                value={formData.chosenName}
                onValueChange={(value) =>
                  handleInputChange("chosenName", value)
                }
                size="sm"
                classNames={{
                  label: "text-small",
                }}
              />

              <Select
                isRequired
                label="Gender"
                placeholder="Select gender"
                selectedKeys={formData.gender ? [formData.gender] : []}
                onSelectionChange={(keys) =>
                  handleInputChange("gender", Array.from(keys)[0] as string)
                }
                size="sm"
                classNames={{
                  label: "text-small",
                }}
              >
                <SelectItem key="male">
                  Male
                </SelectItem>
                <SelectItem key="female">
                  Female
                </SelectItem>
                <SelectItem key="other">
                  Other
                </SelectItem>
              </Select>

              <Input
                isRequired
                type="date"
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={formData.dateOfBirth}
                onValueChange={(value) =>
                  handleInputChange("dateOfBirth", value)
                }
                size="sm"
                classNames={{
                  label: "text-small",
                }}
              />

              <Input
                isRequired
                label="Place of Birth"
                placeholder="City, Country"
                value={formData.placeOfBirth}
                onValueChange={(value) =>
                  handleInputChange("placeOfBirth", value)
                }
                size="sm"
                classNames={{
                  label: "text-small",
                }}
              />

              <Input
                isRequired
                label="Nationality"
                placeholder="Enter nationality"
                value={formData.nationality}
                onValueChange={(value) =>
                  handleInputChange("nationality", value)
                }
                size="sm"
                classNames={{
                  label: "text-small",
                }}
              />
            </div>

            <Divider className="my-2 sm:my-4" />

            {/* Background Information */}
            <div>
              <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                Background Information
              </h4>

              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Input
                    label="Nationality"
                    placeholder="Nationality"
                    value={formData.backgroundInfo.nationality}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        backgroundInfo: {
                          ...formData.backgroundInfo,
                          nationality: value,
                        },
                      });
                    }}
                    size="sm"
                    classNames={{
                      label: "text-small",
                    }}
                  />

                  <Input
                    label="Languages Spoken at Home"
                    placeholder="Languages separated by commas"
                    value={formData.backgroundInfo.languagesSpokenAtHome}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        backgroundInfo: {
                          ...formData.backgroundInfo,
                          languagesSpokenAtHome: value,
                        },
                      });
                    }}
                    size="sm"
                    classNames={{
                      label: "text-small",
                    }}
                  />
                </div>

                <Textarea
                  label="Residential Address"
                  placeholder="Street Name, House Number, Commune/Neighborhood, City, Province, Postal Code"
                  minRows={2}
                  value={formData.backgroundInfo.residentialAddress}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      backgroundInfo: {
                        ...formData.backgroundInfo,
                        residentialAddress: value,
                      },
                    });
                  }}
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Select
                    label="Student Lives With"
                    placeholder="Select an option"
                    selectedKeys={
                      formData.backgroundInfo.studentLivesWith
                        ? [formData.backgroundInfo.studentLivesWith]
                        : []
                    }
                    onSelectionChange={(keys) => {
                      setFormData({
                        ...formData,
                        backgroundInfo: {
                          ...formData.backgroundInfo,
                          studentLivesWith: Array.from(keys)[0] as string,
                        },
                      });
                    }}
                    size="sm"
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    <SelectItem key="father">
                      Father
                    </SelectItem>
                    <SelectItem key="mother">
                      Mother
                    </SelectItem>
                    <SelectItem key="self">
                      Self (18+ years old)
                    </SelectItem>
                    <SelectItem key="legal_guardian">
                      Legal Guardian
                    </SelectItem>
                    <SelectItem key="foster_parent">
                      Foster Parent
                    </SelectItem>
                    <SelectItem key="other">
                      Other
                    </SelectItem>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      isSelected={formData.backgroundInfo.learningSupport}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          backgroundInfo: {
                            ...formData.backgroundInfo,
                            learningSupport: value,
                          },
                        });
                      }}
                      size="sm"
                    />
                    <span className="text-sm">Learning Support Needs?</span>
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-2 sm:my-4" />

            {/* Siblings Enrolled at YALS */}
            <div>
              <h4 className="text-base sm:text-lg font-medium mb-2">
                Siblings Enrolled at YALS
              </h4>
              <p className="text-default-500 text-xs sm:text-sm mb-3 sm:mb-4">
                If the student has siblings currently enrolled at YALS, please
                provide their information below.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {formData.siblings.map((sibling, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                  >
                    <Input
                      label="Name"
                      placeholder="Full Name"
                      value={sibling.name || ""}
                      onValueChange={(value) => {
                        const newSiblings = [...formData.siblings];
                        newSiblings[index] = {
                          ...newSiblings[index],
                          name: value,
                        };
                        setFormData({
                          ...formData,
                          siblings: newSiblings,
                        });
                      }}
                      size="sm"
                      classNames={{
                        label: "text-small",
                      }}
                    />

                    <div className="flex gap-2">
                      <Select
                        label="Grade"
                        placeholder="Grade/Class"
                        selectedKeys={sibling.grade ? [sibling.grade] : []}
                        onSelectionChange={(keys) => {
                          const newSiblings = [...formData.siblings];
                          newSiblings[index] = {
                            ...newSiblings[index],
                            grade: Array.from(keys)[0] as string,
                          };
                          setFormData({
                            ...formData,
                            siblings: newSiblings,
                          });
                        }}
                        className="flex-1"
                        size="sm"
                        isLoading={isLoading.grades}
                        classNames={{
                          label: "text-small",
                        }}
                      >
                        {grades.length === 0 ? (
                          <SelectItem key="loading">No grades available</SelectItem>
                        ) : (
                          grades.map((grade) => (
                            <SelectItem key={grade.id.toString()}>
                              {grade.name} ({grade.cycle === "maternel" ? "Maternel" : "Primary"})
                            </SelectItem>
                          ))
                        )}
                      </Select>

                      {formData.siblings.length > 1 && (
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          onClick={() => {
                            const newSiblings = formData.siblings.filter(
                              (_, i) => i !== index
                            );
                            setFormData({
                              ...formData,
                              siblings: newSiblings,
                            });
                          }}
                          className="mt-5 px-2 min-w-0 h-8"
                          isIconOnly
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant="bordered"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      siblings: [
                        ...formData.siblings,
                        {
                          name: "",
                          grade: "",
                        },
                      ],
                    });
                  }}
                  className="w-full text-xs sm:text-sm py-2 mt-2"
                  size="sm"
                  startContent={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  Add Another Sibling
                </Button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">Parents/Guardians</h3>
              <p className="text-default-600 text-sm mt-1">
                Please provide information about the student's parents or legal
                guardians.
              </p>
            </div>

            {/* Premier parent/tuteur */}
            <div>
              <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                Primary Parent/Guardian
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Input
                  isRequired
                  label="Full Name"
                  placeholder="Enter full name"
                  value={formData.parent1.fullName}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      parent1: {
                        ...formData.parent1,
                        fullName: value,
                      },
                    });
                  }}
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                />

                <Select
                  isRequired
                  label="Relationship to Student"
                  placeholder="Select relationship"
                  selectedKeys={
                    formData.parent1.relationship
                      ? [formData.parent1.relationship]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    setFormData({
                      ...formData,
                      parent1: {
                        ...formData.parent1,
                        relationship: Array.from(keys)[0] as string,
                      },
                    });
                  }}
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                >
                  <SelectItem key="mother">
                    Mother
                  </SelectItem>
                  <SelectItem key="father">
                    Father
                  </SelectItem>
                  <SelectItem key="grandparent">
                    Grandparent
                  </SelectItem>
                  <SelectItem key="uncle">
                    Uncle
                  </SelectItem>
                  <SelectItem key="aunt">
                    Aunt
                  </SelectItem>
                  <SelectItem key="legal_guardian">
                    Legal Guardian
                  </SelectItem>
                  <SelectItem key="self">
                    Self (18+ years old)
                  </SelectItem>
                  <SelectItem key="other">
                    Other
                  </SelectItem>
                </Select>

                <Select
                  isRequired
                  label="Preferred Communication Language"
                  placeholder="Select language"
                  selectedKeys={
                    formData.parent1.preferredLanguage
                      ? [formData.parent1.preferredLanguage]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    setFormData({
                      ...formData,
                      parent1: {
                        ...formData.parent1,
                        preferredLanguage: Array.from(keys)[0] as string,
                      },
                    });
                  }}
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                >
                  <SelectItem key="english">
                    English
                  </SelectItem>
                  <SelectItem key="french">
                    French
                  </SelectItem>
                </Select>

                <Input
                  label="Work Phone"
                  type="tel"
                  placeholder="Enter work phone"
                  value={formData.parent1.workPhone}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      parent1: {
                        ...formData.parent1,
                        workPhone: value,
                      },
                    });
                  }}
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                />

                <Input
                  isRequired
                  label="Mobile Phone"
                  type="tel"
                  placeholder="Enter mobile phone"
                  value={formData.parent1.mobilePhone}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      parent1: {
                        ...formData.parent1,
                        mobilePhone: value,
                      },
                    });
                  }}
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                />

                <Input
                  isRequired
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.parent1.email}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      parent1: {
                        ...formData.parent1,
                        email: value,
                      },
                    });
                  }}
                  size="sm"
                  classNames={{
                    label: "text-small",
                  }}
                />
              </div>

              <div className="mt-4 sm:mt-6">
                <h5 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Address</h5>
                <RadioGroup
                  orientation="horizontal"
                  value={formData.parent1.address}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      parent1: {
                        ...formData.parent1,
                        address: value,
                      },
                    });
                  }}
                  size="sm"
                  classNames={{
                    wrapper: "gap-4"
                  }}
                >
                  <Radio value="same">Same as Student</Radio>
                  <Radio value="different">Different Address</Radio>
                </RadioGroup>

                {formData.parent1.address === "different" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-3 sm:mt-4">
                    <Input
                      label="Address"
                      placeholder="Enter address"
                      className="sm:col-span-2"
                      value={formData.parent1.differentAddress}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          parent1: {
                            ...formData.parent1,
                            differentAddress: value,
                          },
                        });
                      }}
                      size="sm"
                      classNames={{
                        label: "text-small",
                      }}
                    />

                    <Input
                      label="City"
                      placeholder="Enter city"
                      value={formData.parent1.differentCity}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          parent1: {
                            ...formData.parent1,
                            differentCity: value,
                          },
                        });
                      }}
                      size="sm"
                      classNames={{
                        label: "text-small",
                      }}
                    />

                    <Input
                      label="Postal Code"
                      placeholder="Enter postal code"
                      value={formData.parent1.differentPostalCode}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          parent1: {
                            ...formData.parent1,
                            differentPostalCode: value,
                          },
                        });
                      }}
                      size="sm"
                      classNames={{
                        label: "text-small",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <Divider className="my-2 sm:my-4" />

            {/* Deuxième parent/tuteur */}
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Checkbox
                  isSelected={formData.hasSecondParent}
                  onValueChange={(value) =>
                    handleInputChange("hasSecondParent", value)
                  }
                  size="sm"
                />
                <span className="text-sm">Add a second parent/guardian</span>
              </div>

              {formData.hasSecondParent && (
                <div className="mt-3 sm:mt-4">
                  <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Second Parent/Guardian
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input
                      isRequired
                      label="First Name"
                      placeholder="Enter first name"
                      value={formData.parent2.firstName}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          parent2: {
                            ...formData.parent2,
                            firstName: value,
                          },
                        });
                      }}
                      size="sm"
                      classNames={{
                        label: "text-small",
                      }}
                    />

                    <Input
                      isRequired
                      label="Last Name"
                      placeholder="Enter last name"
                      value={formData.parent2.lastName}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          parent2: {
                            ...formData.parent2,
                            lastName: value,
                          },
                        });
                      }}
                      size="sm"
                      classNames={{
                        label: "text-small",
                      }}
                    />

                    <Select
                      isRequired
                      label="Relationship to Student"
                      placeholder="Select relationship"
                      selectedKeys={
                        formData.parent2.relationship
                          ? [formData.parent2.relationship]
                          : []
                      }
                      onSelectionChange={(keys) => {
                        setFormData({
                          ...formData,
                          parent2: {
                            ...formData.parent2,
                            relationship: Array.from(keys)[0] as string,
                          },
                        });
                      }}
                      size="sm"
                      classNames={{
                        label: "text-small",
                      }}
                    >
                      <SelectItem key="mother">
                        Mother
                      </SelectItem>
                      <SelectItem key="father">
                        Father
                      </SelectItem>
                      <SelectItem key="grandparent">
                        Grandparent
                      </SelectItem>
                      <SelectItem key="uncle">
                        Uncle
                      </SelectItem>
                      <SelectItem key="aunt">
                        Aunt
                      </SelectItem>
                      <SelectItem key="legal_guardian">
                        Legal Guardian
                      </SelectItem>
                      <SelectItem key="self">
                        Self (18+ years old)
                      </SelectItem>
                      <SelectItem key="other">
                        Other
                      </SelectItem>
                    </Select>

                    <Input
                      label="Mobile Phone"
                      type="tel"
                      placeholder="Enter mobile phone"
                      value={formData.parent2.mobilePhone}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          parent2: {
                            ...formData.parent2,
                            mobilePhone: value,
                          },
                        });
                      }}
                    />

                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.parent2.email}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          parent2: {
                            ...formData.parent2,
                            email: value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Divider className="my-4" />

            {/* Authorized Pickup Contacts */}
            <div>
              <h4 className="text-lg font-medium mb-4">Authorized Pickup Contacts</h4>

              <div className="space-y-4">
                {formData.authorizedPickupContacts.map((contact, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      isRequired
                      label="Name *"
                      placeholder="Full Name"
                      value={contact.name || ""}
                      onValueChange={(value) => {
                        const newContacts = [...formData.authorizedPickupContacts];
                        newContacts[index] = {
                          ...newContacts[index],
                          name: value,
                        };
                        setFormData({
                          ...formData,
                          authorizedPickupContacts: newContacts,
                        });
                      }}
                    />

                    <Input
                      isRequired
                      label="Cell Phone *"
                      type="tel"
                      placeholder="+243 999 999 999"
                      value={contact.cellPhone || ""}
                      onValueChange={(value) => {
                        const newContacts = [...formData.authorizedPickupContacts];
                        newContacts[index] = {
                          ...newContacts[index],
                          cellPhone: value,
                        };
                        setFormData({
                          ...formData,
                          authorizedPickupContacts: newContacts,
                        });
                      }}
                    />

                    <div className="flex gap-2">
                      <Select
                        isRequired
                        label="Relationship *"
                        placeholder="Select Relationship"
                        selectedKeys={contact.relationship ? [contact.relationship] : []}
                        onSelectionChange={(keys) => {
                          const newContacts = [...formData.authorizedPickupContacts];
                          newContacts[index] = {
                            ...newContacts[index],
                            relationship: Array.from(keys)[0] as string,
                          };
                          setFormData({
                            ...formData,
                            authorizedPickupContacts: newContacts,
                          });
                        }}
                        className="flex-1"
                      >
                        <SelectItem key="step_parent">
                          Step Parent
                        </SelectItem>
                        <SelectItem key="relative">
                          Relative
                        </SelectItem>
                        <SelectItem key="neighbor">
                          Neighbor
                        </SelectItem>
                        <SelectItem key="other">
                          Other
                        </SelectItem>
                      </Select>

                      {formData.authorizedPickupContacts.length > 1 && (
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          onClick={() => {
                            const newContacts = formData.authorizedPickupContacts.filter(
                              (_, i) => i !== index
                            );
                            setFormData({
                              ...formData,
                              authorizedPickupContacts: newContacts,
                            });
                          }}
                          className="mt-6"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant="bordered"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      authorizedPickupContacts: [
                        ...formData.authorizedPickupContacts,
                        {
                          name: "",
                          cellPhone: "",
                          relationship: "",
                        },
                      ],
                    });
                  }}
                  className="w-full"
                >
                  + ADD ANOTHER AUTHORIZED PERSON
                </Button>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Emergency Contact */}
            <div>
              <h4 className="text-lg font-medium mb-2">Emergency Contact</h4>
              <p className="text-default-500 text-sm mb-4">
                Person to contact in case of emergency (other than Parent/Guardian)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  isRequired
                  label="Full Name *"
                  placeholder="Full Name"
                  value={formData.emergencyContact.fullName}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      emergencyContact: {
                        ...formData.emergencyContact,
                        fullName: value,
                      },
                    });
                  }}
                />

                <Select
                  isRequired
                  label="Relationship *"
                  placeholder="Select Relationship"
                  selectedKeys={
                    formData.emergencyContact.relationship
                      ? [formData.emergencyContact.relationship]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    setFormData({
                      ...formData,
                      emergencyContact: {
                        ...formData.emergencyContact,
                        relationship: Array.from(keys)[0] as string,
                      },
                    });
                  }}
                >
                  <SelectItem key="neighbor">
                    Neighbor
                  </SelectItem>
                  <SelectItem key="family">
                    Family
                  </SelectItem>
                  <SelectItem key="other">
                    Other
                  </SelectItem>
                </Select>

                <Input
                  isRequired
                  label="Mobile Phone *"
                  type="tel"
                  placeholder="+243 999 999 999"
                  value={formData.emergencyContact.mobilePhone}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      emergencyContact: {
                        ...formData.emergencyContact,
                        mobilePhone: value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Health and Education</h3>
              <p className="text-default-600 mt-1">
                Medical information and educational background
              </p>
            </div>

            {/* Health Information */}
            <div>
              <h4 className="text-lg font-medium mb-4">Health Information</h4>

              {/* Main Health Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={formData.healthInfo.allergies}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        healthInfo: {
                          ...formData.healthInfo,
                          allergies: value,
                        },
                      });
                    }}
                  />
                  <span>Allergies</span>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={formData.healthInfo.chronicIllness}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        healthInfo: {
                          ...formData.healthInfo,
                          chronicIllness: value,
                        },
                      });
                    }}
                  />
                  <span>Chronic Illness</span>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={formData.healthInfo.regularMedication}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        healthInfo: {
                          ...formData.healthInfo,
                          regularMedication: value,
                        },
                      });
                    }}
                  />
                  <span>Regular Medication</span>
                </div>
              </div>

              {/* Specific Medical Conditions */}
              <div className="mb-6">
                <h5 className="text-base font-medium mb-3">Specific Medical Conditions</h5>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      isSelected={formData.healthInfo.specificMedicalConditions.asthma}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          healthInfo: {
                            ...formData.healthInfo,
                            specificMedicalConditions: {
                              ...formData.healthInfo.specificMedicalConditions,
                              asthma: value,
                            },
                          },
                        });
                      }}
                    />
                    <span className="text-sm">Asthma</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      isSelected={formData.healthInfo.specificMedicalConditions.severeAllergies}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          healthInfo: {
                            ...formData.healthInfo,
                            specificMedicalConditions: {
                              ...formData.healthInfo.specificMedicalConditions,
                              severeAllergies: value,
                            },
                          },
                        });
                      }}
                    />
                    <span className="text-sm">Severe Allergies (EpiPen)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      isSelected={formData.healthInfo.specificMedicalConditions.diabetes}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          healthInfo: {
                            ...formData.healthInfo,
                            specificMedicalConditions: {
                              ...formData.healthInfo.specificMedicalConditions,
                              diabetes: value,
                            },
                          },
                        });
                      }}
                    />
                    <span className="text-sm">Diabetes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      isSelected={formData.healthInfo.specificMedicalConditions.seizures}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          healthInfo: {
                            ...formData.healthInfo,
                            specificMedicalConditions: {
                              ...formData.healthInfo.specificMedicalConditions,
                              seizures: value,
                            },
                          },
                        });
                      }}
                    />
                    <span className="text-sm">Seizures</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      isSelected={formData.healthInfo.specificMedicalConditions.other}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          healthInfo: {
                            ...formData.healthInfo,
                            specificMedicalConditions: {
                              ...formData.healthInfo.specificMedicalConditions,
                              other: value,
                            },
                          },
                        });
                      }}
                    />
                    <span className="text-sm">Other</span>
                  </div>
                </div>
              </div>

              {/* Doctor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  label="Doctor's Name"
                  placeholder="Dr. Dupont"
                  value={formData.healthInfo.doctorName}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      healthInfo: {
                        ...formData.healthInfo,
                        doctorName: value,
                      },
                    });
                  }}
                />

                <Input
                  label="Doctor's Phone"
                  type="tel"
                  placeholder="+33 1 23 45 67 89"
                  value={formData.healthInfo.doctorPhone}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      healthInfo: {
                        ...formData.healthInfo,
                        doctorPhone: value,
                      },
                    });
                  }}
                />
              </div>

              {/* Mode of Transport */}
              <div>
                <h5 className="text-base font-medium mb-3">Mode of Transport</h5>
                <RadioGroup
                  orientation="horizontal"
                  value={formData.healthInfo.modeOfTransport}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      healthInfo: {
                        ...formData.healthInfo,
                        modeOfTransport: value,
                      },
                    });
                  }}
                  className="gap-6"
                >
                  <Radio value="walk">Walk</Radio>
                  <Radio value="bus">Bus</Radio>
                  <Radio value="car">Car</Radio>
                  <Radio value="public">Public Transport</Radio>
                </RadioGroup>
              </div>
            </div>

            <Divider />

            {/* Education Background */}
            <div>
              <h4 className="text-lg font-medium mb-4">Education Background</h4>

              <div className="space-y-4">
                {formData.educationHistory.map((school, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="School Name"
                      placeholder="Name of Institution"
                      value={school.schoolName || ""}
                      onValueChange={(value) => {
                        const newHistory = [...formData.educationHistory];
                        newHistory[index] = {
                          ...newHistory[index],
                          schoolName: value,
                        };
                        setFormData({
                          ...formData,
                          educationHistory: newHistory,
                        });
                      }}
                    />

                    <div className="flex gap-2">
                      <Input
                        label="Reason for Leaving"
                        placeholder="Reason for Change"
                        value={school.reasonForLeaving || ""}
                        onValueChange={(value) => {
                          const newHistory = [...formData.educationHistory];
                          newHistory[index] = {
                            ...newHistory[index],
                            reasonForLeaving: value,
                          };
                          setFormData({
                            ...formData,
                            educationHistory: newHistory,
                          });
                        }}
                        className="flex-1"
                      />

                      {formData.educationHistory.length > 1 && (
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          onClick={() => {
                            const newHistory = formData.educationHistory.filter(
                              (_, i) => i !== index
                            );
                            setFormData({
                              ...formData,
                              educationHistory: newHistory,
                            });
                          }}
                          className="mt-6"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant="bordered"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      educationHistory: [
                        ...formData.educationHistory,
                        {
                          schoolName: "",
                          reasonForLeaving: "",
                        },
                      ],
                    });
                  }}
                  className="w-full"
                >
                  + ADD ANOTHER SCHOOL
                </Button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Documents and Consents</h3>
              <p className="text-default-600 mt-1">
                Final validation and attachments
              </p>
            </div>

            {/* Media Release */}
            <div className="bg-default-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Media Release</h4>
              <p className="text-default-600 text-sm mb-4">
                Please indicate whether you authorize YALS to photograph or video record your child for school purposes.
              </p>
              
              <RadioGroup
                value={formData.mediaRelease}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    mediaRelease: value,
                  });
                }}
                className="gap-4"
              >
                <Radio value="yes">Yes (photograph/video allowed)</Radio>
                <Radio value="no">No (not allowed)</Radio>
              </RadioGroup>
            </div>

            {/* Fee Acceptance */}
            <div className="bg-default-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Fee Acceptance</h4>
              <p className="text-default-600 text-sm mb-4">
                Please acknowledge that you understand and agree to pay the non-refundable enrollment fee.
              </p>
              
              <RadioGroup
                value={formData.feeAcceptance}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    feeAcceptance: value,
                  });
                }}
                className="gap-4"
              >
                <Radio value="yes">Yes (agree to pay $300 non-refundable fee)</Radio>
                <Radio value="no">No</Radio>
              </RadioGroup>
            </div>

            {/* Medical Authorization */}
            <div className="bg-default-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Medical Authorization</h4>
              <p className="text-default-600 text-sm mb-4">
                In case of emergency, I authorize YALS to take necessary medical measures for my child.
              </p>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  isSelected={formData.medicalAuthorization}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      medicalAuthorization: value,
                    });
                  }}
                />
                <span>I authorize emergency medical treatment if needed</span>
              </div>
            </div>

            {/* Documents to Provide */}
            <div className="bg-default-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Documents to Provide</h4>
              <p className="text-default-600 text-sm mb-4">
                Please check the documents you are submitting with this application.
              </p>
              
              <div className="space-y-6">
                {/* Document 1: Passport Photos */}
                <div className="bg-content1 p-4 rounded-lg border border-divider">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      isSelected={formData.documents.passportPhotos.checked}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          documents: {
                            ...formData.documents,
                            passportPhotos: {
                              ...formData.documents.passportPhotos,
                              checked: value,
                            },
                          },
                        });
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-default-900 mb-2">
                        1. Two Recent Passport-sized Photographs
                      </h5>
                      
                      {!formData.documents.passportPhotos.file ? (
                        <div className="border-2 border-dashed border-default-300 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload('passportPhotos', file);
                              }
                            }}
                            className="hidden"
                            id="passportPhotos"
                          />
                          <label
                            htmlFor="passportPhotos"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-default-700">Click to upload photos</p>
                              <p className="text-xs text-default-500">PNG, JPG up to 10MB</p>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-success">{formData.documents.passportPhotos.fileName}</p>
                                <p className="text-xs text-success">File uploaded successfully</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="light"
                              color="danger"
                              onClick={() => handleFileRemove('passportPhotos')}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document 2: School Report */}
                <div className="bg-content1 p-4 rounded-lg border border-divider">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      isSelected={formData.documents.schoolReport.checked}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          documents: {
                            ...formData.documents,
                            schoolReport: {
                              ...formData.documents.schoolReport,
                              checked: value,
                            },
                          },
                        });
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-default-900 mb-2">
                        2. Previous School Report/Transcript
                      </h5>
                      
                      {!formData.documents.schoolReport.file ? (
                        <div className="border-2 border-dashed border-default-300 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload('schoolReport', file);
                              }
                            }}
                            className="hidden"
                            id="schoolReport"
                          />
                          <label
                            htmlFor="schoolReport"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-default-700">Click to upload document</p>
                              <p className="text-xs text-default-500">PDF, DOC, DOCX, or image up to 10MB</p>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-success">{formData.documents.schoolReport.fileName}</p>
                                <p className="text-xs text-success">File uploaded successfully</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="light"
                              color="danger"
                              onClick={() => handleFileRemove('schoolReport')}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document 3: Parent ID */}
                <div className="bg-content1 p-4 rounded-lg border border-divider">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      isSelected={formData.documents.parentId.checked}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          documents: {
                            ...formData.documents,
                            parentId: {
                              ...formData.documents.parentId,
                              checked: value,
                            },
                          },
                        });
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-default-900 mb-2">
                        3. Parent/Guardian ID Copy
                      </h5>
                      
                      {!formData.documents.parentId.file ? (
                        <div className="border-2 border-dashed border-default-300 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload('parentId', file);
                              }
                            }}
                            className="hidden"
                            id="parentId"
                          />
                          <label
                            htmlFor="parentId"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-default-700">Click to upload ID copy</p>
                              <p className="text-xs text-default-500">PDF or image up to 10MB</p>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-success">{formData.documents.parentId.fileName}</p>
                                <p className="text-xs text-success">File uploaded successfully</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="light"
                              color="danger"
                              onClick={() => handleFileRemove('parentId')}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document 4: Student ID */}
                <div className="bg-content1 p-4 rounded-lg border border-divider">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      isSelected={formData.documents.studentId.checked}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          documents: {
                            ...formData.documents,
                            studentId: {
                              ...formData.documents.studentId,
                              checked: value,
                            },
                          },
                        });
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-default-900 mb-2">
                        4. Student ID Copy
                      </h5>
                      
                      {!formData.documents.studentId.file ? (
                        <div className="border-2 border-dashed border-default-300 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload('studentId', file);
                              }
                            }}
                            className="hidden"
                            id="studentId"
                          />
                          <label
                            htmlFor="studentId"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-default-700">Click to upload ID copy</p>
                              <p className="text-xs text-default-500">PDF or image up to 10MB</p>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-success">{formData.documents.studentId.fileName}</p>
                                <p className="text-xs text-success">File uploaded successfully</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="light"
                              color="danger"
                              onClick={() => handleFileRemove('studentId')}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Consent Form */}
            <div className="bg-default-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Consent Form</h4>
              <p className="text-default-600 text-sm mb-4">
                I certify that all information provided in this application is true and complete to the best of my knowledge.
              </p>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  isSelected={formData.consentForm}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      consentForm: value,
                    });
                  }}
                />
                <span>I certify that all information provided is truthful and accurate</span>
              </div>
            </div>

            {/* Digital Signature */}
            <div className="bg-default-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Digital Signature</h4>
              <p className="text-default-600 text-sm mb-4">
                Sign below to confirm all information *
              </p>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-default-300 rounded-lg p-8 min-h-[120px] bg-white">
                  {formData.digitalSignature ? (
                    <div className="text-center">
                      <p className="text-lg font-medium">{formData.digitalSignature}</p>
                      <p className="text-sm text-default-500 mt-2">Digital Signature</p>
                    </div>
                  ) : (
                    <div className="text-center text-default-400">
                      <p>Click below to add your signature</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <Input
                    placeholder="Type your full name as signature"
                    value={formData.digitalSignature}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        digitalSignature: value,
                      });
                    }}
                    className="flex-1"
                  />
                  
                  <Button
                    variant="bordered"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        digitalSignature: "",
                      });
                    }}
                  >
                    × CLEAR SIGNATURE
                  </Button>
                </div>
              </div>
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
        <h1 className={title({ class: "text-3xl sm:text-4xl md:text-5xl" })}>Application Form</h1>
        <p className={subtitle({ class: "max-w-3xl mx-auto text-sm sm:text-base" })}>
          Complete the form below to apply for admission to Young African
          Leaders School
        </p>
      </section>

      {/* Application Form - New Layout */}
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
                    <span className={`text-sm font-medium ${currentStep === 1 ? "text-primary" : "text-default-700"}`}>
                      Student Information
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Basic details about the student
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
                    <span className={`text-sm font-medium ${currentStep === 2 ? "text-primary" : "text-default-700"}`}>
                      Parents   
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Contact information
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
                    <span className={`text-sm font-medium ${currentStep === 3 ? "text-primary" : "text-default-700"}`}>
                      Health and Education
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Health details and school history
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
                    4
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${currentStep === 4 ? "text-primary" : "text-default-700"}`}>
                      Documents and Consents
                    </span>
                    <span className="text-xs text-default-400 mt-1">
                      Required files and agreements
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Progress Indicator - Only visible on small screens */}
            <div className="block md:hidden w-full bg-content1 p-4 border-b border-divider">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-primary">YALS</h2>
                <span className="text-sm text-default-500">Step {currentStep} of {totalSteps}</span>
              </div>
              
              {/* Horizontal Progress Bar */}
              <Progress 
                value={(currentStep / totalSteps) * 100} 
                className="h-2 mb-4" 
                color="primary"
              />
              
              {/* Current Step Title */}
              <h3 className="text-sm font-medium text-center">
                {currentStep === 1 && "Student Information"}
                {currentStep === 2 && "Parents/Guardians"}
                {currentStep === 3 && "Health and Education"}
                {currentStep === 4 && "Documents and Consents"}
              </h3>
            </div>
            
            {/* Right Content Area */}
            <div className="w-full md:w-3/4 flex flex-col">
              <div className="p-4 sm:p-6 md:p-8 flex-1">
                <div className="mb-4 md:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {currentStep === 1 && "Student Information"}
                    {currentStep === 2 && "Parents/Guardians"}
                    {currentStep === 3 && "Health and Education"}
                    {currentStep === 4 && "Documents and Consents"}
                  </h2>
                  <p className="text-sm text-default-500 mt-1">
                    {currentStep === 1 && "Please provide the student's personal details"}
                    {currentStep === 2 && "Information about parents and emergency contacts"}
                    {currentStep === 3 && "Medical information and educational background"}
                    {currentStep === 4 && "Upload necessary documents and provide consent"}
                  </p>
                </div>
                
                <div className="py-2 sm:py-4">
                  {renderStepContent()}
                </div>
              </div>
              
              {/* Footer with Navigation */}
              <div className="mt-auto p-4 sm:p-6 bg-default-50 border-t border-divider">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <Button
                    className={buttonStyles({
                      variant: "light",
                      fullWidth: true,
                      class: "sm:w-auto"
                    })}
                    onClick={handlePrevious}
                    isDisabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      className={buttonStyles({
                        variant: "bordered",
                        fullWidth: true,
                        class: "sm:w-auto"
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
                          fullWidth: true,
                          class: "sm:w-auto"
                        })}
                        onClick={handleNext}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className={buttonStyles({
                          color: "primary",
                          variant: "shadow",
                          fullWidth: true,
                          class: "sm:w-auto"
                        })}
                        onClick={async () => {
                          try {
                            // Transform form data to API format
                            const apiData = transformFormDataToAPI();
                            
                            // Log the data for debugging
                            console.log("API Data:", JSON.stringify(apiData, null, 2));
                            
                            // Send the data to your API
                            const response = await fetch('/api/admissions/apply', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(apiData)
                            });
                            
                            const result = await response.json();
                            
                            if (response.ok && result.success) {
                              alert(`Application submitted successfully! Application ID: ${result.applicationId}`);
                              // Optionally redirect to a success page
                              // window.location.href = '/admissions/success';
                            } else {
                              alert(`Error submitting application: ${result.message}`);
                            }
                            
                          } catch (error) {
                            console.error("Error submitting application:", error);
                            alert("Error submitting application. Please try again.");
                          }
                        }}
                      >
                        Submit Application
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Help Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto mt-8">
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
