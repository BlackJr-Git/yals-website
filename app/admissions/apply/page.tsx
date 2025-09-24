"use client";

import { useState } from "react";
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
      (sibling) => sibling.name.trim() !== "" && sibling.grade.trim() !== ""
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
        requested_class_id: parseInt(formData.gradeApplying.replace('grade', '')) || 1,
        birth_place: formData.placeOfBirth,
        nationality: formData.nationality,
        languages_spoken: formData.backgroundInfo.languagesSpokenAtHome,
        residential_address: formData.backgroundInfo.residentialAddress,
        lives_with: formData.backgroundInfo.studentLivesWith.replace('-', '_'),
        has_learning_support_needs: formData.backgroundInfo.learningSupport,
        learning_support_details: formData.backgroundInfo.learningSupport ? "Learning support needed" : "",
        academic_year_id: parseInt(formData.academicYear) - 2023 // Convert year to ID (assuming 2024 = 1, 2025 = 2)
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
          (sibling) => sibling.name.trim() !== "" || sibling.grade.trim() !== ""
        );

        if (hasFilledSiblings) {
          const incompleteSibling = formData.siblings.find(
            (sibling) =>
              (sibling.name.trim() !== "" && !sibling.grade.trim()) ||
              (sibling.grade.trim() !== "" && !sibling.name.trim())
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
          <div className="space-y-8">
            {/* Informations académiques */}
            <div>
              <h4 className="text-lg font-medium mb-4">Academic Information</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Select
                  isRequired
                  label="Grade Applying For"
                  placeholder="Select grade"
                  selectedKeys={
                    formData.gradeApplying ? [formData.gradeApplying] : []
                  }
                  onSelectionChange={(keys) =>
                    handleInputChange("gradeApplying", Array.from(keys)[0] as string)
                  }
                  className="md:col-span-1"
                >
                  <SelectItem key="grade1">
                    Grade 1
                  </SelectItem>
                  <SelectItem key="grade2">
                    Grade 2
                  </SelectItem>
                  <SelectItem key="grade3">
                    Grade 3
                  </SelectItem>
                  <SelectItem key="grade4">
                    Grade 4
                  </SelectItem>
                  <SelectItem key="grade5">
                    Grade 5
                  </SelectItem>
                  <SelectItem key="grade6">
                    Grade 6
                  </SelectItem>
                  <SelectItem key="grade7">
                    Grade 7
                  </SelectItem>
                  <SelectItem key="grade8">
                    Grade 8
                  </SelectItem>
                  <SelectItem key="grade9">
                    Grade 9
                  </SelectItem>
                  <SelectItem key="grade10">
                    Grade 10
                  </SelectItem>
                  <SelectItem key="grade11">
                    Grade 11
                  </SelectItem>
                  <SelectItem key="grade12">
                    Grade 12
                  </SelectItem>
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
                  className="md:col-span-1"
                >
                  <SelectItem key="2025">
                    2025
                  </SelectItem>
                  {/* <SelectItem key="2026" value="2026">
                    2026
                  </SelectItem> */}
                </Select>
              </div>
            </div>
            <Divider />
            <div>
              <h3 className="text-xl font-semibold">Student Information</h3>
              <p className="text-default-600 mt-1">
                In this section, you'll provide basic information about the
                student applying for admission.
              </p>
            </div>

            {/* Formulaire d'informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                isRequired
                label="First Name"
                placeholder="Enter student's first name"
                value={formData.firstName}
                onValueChange={(value) => handleInputChange("firstName", value)}
              />

              <Input
                label="Middle Name (if applicable)"
                placeholder="Enter student's middle name"
                value={formData.middleName}
                onValueChange={(value) =>
                  handleInputChange("middleName", value)
                }
              />

              <Input
                isRequired
                label="Last Name"
                placeholder="Enter student's last name"
                value={formData.lastName}
                onValueChange={(value) => handleInputChange("lastName", value)}
              />

              <Input
                label="Suffix (if applicable)"
                placeholder="Jr, Sr, II, III, IV, V"
                value={formData.suffix}
                onValueChange={(value) => handleInputChange("suffix", value)}
              />

              <Input
                label="Chosen Name (if applicable)"
                placeholder="Preferred name or nickname"
                value={formData.chosenName}
                onValueChange={(value) =>
                  handleInputChange("chosenName", value)
                }
              />

              <Select
                isRequired
                label="Gender"
                placeholder="Select gender"
                selectedKeys={formData.gender ? [formData.gender] : []}
                onSelectionChange={(keys) =>
                  handleInputChange("gender", Array.from(keys)[0] as string)
                }
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
              />

              <Input
                isRequired
                label="Place of Birth"
                placeholder="City, Country"
                value={formData.placeOfBirth}
                onValueChange={(value) =>
                  handleInputChange("placeOfBirth", value)
                }
              />

              <Input
                isRequired
                label="Nationality"
                placeholder="Enter nationality"
                value={formData.nationality}
                onValueChange={(value) =>
                  handleInputChange("nationality", value)
                }
              />
            </div>

            <Divider className="my-4" />

            {/* Adresse */}
            {/* <div>
              <h4 className="text-lg font-medium mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  isRequired
                  label="Address"
                  placeholder="Street address"
                  className="md:col-span-2"
                  value={formData.address}
                  onValueChange={(value) => handleInputChange("address", value)}
                />

                <Input
                  isRequired
                  label="City"
                  placeholder="City"
                  value={formData.city}
                  onValueChange={(value) => handleInputChange("city", value)}
                />

                <Input
                  label="Postal Code"
                  placeholder="Postal code"
                  value={formData.postalCode}
                  onValueChange={(value) =>
                    handleInputChange("postalCode", value)
                  }
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phoneNumber}
                  onValueChange={(value) =>
                    handleInputChange("phoneNumber", value)
                  }
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onValueChange={(value) => handleInputChange("email", value)}
                />
              </div>
            </div> */}

            <Divider className="my-4" />

            {/* Background Information */}
            <div>
              <h4 className="text-lg font-medium mb-4">
                Background Information
              </h4>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  />

                  <Input
                    label="Languages Spoken at Home"
                    placeholder="Languages separated by commas (e.g., English, French)"
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
                  />
                </div>

                <Textarea
                  label="Residential Address"
                  placeholder="Street Name, House Number, Commune/Neighborhood, City, Province, Postal Code"
                  minRows={3}
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
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    />
                    <span className="text-sm">Learning Support Needs?</span>
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Siblings Enrolled at YALS */}
            <div>
              <h4 className="text-lg font-medium mb-2">
                Siblings Enrolled at YALS
              </h4>
              <p className="text-default-500 text-sm mb-4">
                If the student has siblings currently enrolled at YALS, please
                provide their information below.
              </p>

              <div className="space-y-4">
                {formData.siblings.map((sibling, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                      >
                        <SelectItem key="grade1">
                          Grade 1
                        </SelectItem>
                        <SelectItem key="grade2">
                          Grade 2
                        </SelectItem>
                        <SelectItem key="grade3">
                          Grade 3
                        </SelectItem>
                        <SelectItem key="grade4">
                          Grade 4
                        </SelectItem>
                        <SelectItem key="grade5">
                          Grade 5
                        </SelectItem>
                        <SelectItem key="grade6">
                          Grade 6
                        </SelectItem>
                        <SelectItem key="grade7">
                          Grade 7
                        </SelectItem>
                        <SelectItem key="grade8">
                          Grade 8
                        </SelectItem>
                        <SelectItem key="grade9">
                          Grade 9
                        </SelectItem>
                        <SelectItem key="grade10">
                          Grade 10
                        </SelectItem>
                        <SelectItem key="grade11">
                          Grade 11
                        </SelectItem>
                        <SelectItem key="grade12">
                          Grade 12
                        </SelectItem>
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
                      siblings: [
                        ...formData.siblings,
                        {
                          name: "",
                          grade: "",
                        },
                      ],
                    });
                  }}
                  className="w-full"
                >
                  + ADD ANOTHER SIBLING
                </Button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold">Parents/Guardians</h3>
              <p className="text-default-600 mt-1">
                Please provide information about the student's parents or legal
                guardians.
              </p>
            </div>

            {/* Premier parent/tuteur */}
            <div>
              <h4 className="text-lg font-medium mb-4">
                Primary Parent/Guardian
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  placeholder="Select preferred language"
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
                >
                  <SelectItem key="english">
                    English
                  </SelectItem>
                  <SelectItem key="french">
                    French
                  </SelectItem>
                </Select>

                {/* <Input
                  label="Occupation"
                  placeholder="Enter occupation"
                  value={formData.parent1.occupation}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      parent1: {
                        ...formData.parent1,
                        occupation: value,
                      },
                    });
                  }}
                /> */}

                {/* <Input
                  label="Employer"
                  placeholder="Enter employer"
                  value={formData.parent1.employer}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      parent1: {
                        ...formData.parent1,
                        employer: value,
                      },
                    });
                  }}
                /> */}

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
                />
              </div>

              <div className="mt-6">
                <h5 className="text-base font-medium mb-3">Address</h5>
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
                >
                  <Radio value="same">Same as Student</Radio>
                  <Radio value="different">Different Address</Radio>
                </RadioGroup>

                {formData.parent1.address === "different" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <Input
                      label="Address"
                      placeholder="Enter address"
                      className="md:col-span-2"
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
                    />
                  </div>
                )}
              </div>
            </div>

            <Divider className="my-4" />

            {/* Deuxième parent/tuteur */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  isSelected={formData.hasSecondParent}
                  onValueChange={(value) =>
                    handleInputChange("hasSecondParent", value)
                  }
                />
                <span>Add a second parent/guardian</span>
              </div>

              {formData.hasSecondParent && (
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-4">
                    Second Parent/Guardian
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="bg-white p-4 rounded-lg border border-default-200">
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
                                <p className="text-sm font-medium text-success-800">{formData.documents.passportPhotos.fileName}</p>
                                <p className="text-xs text-success-600">File uploaded successfully</p>
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
                <div className="bg-white p-4 rounded-lg border border-default-200">
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
                                <p className="text-sm font-medium text-success-800">{formData.documents.schoolReport.fileName}</p>
                                <p className="text-xs text-success-600">File uploaded successfully</p>
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
                <div className="bg-white p-4 rounded-lg border border-default-200">
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
                                <p className="text-sm font-medium text-success-800">{formData.documents.parentId.fileName}</p>
                                <p className="text-xs text-success-600">File uploaded successfully</p>
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
                <div className="bg-white p-4 rounded-lg border border-default-200">
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
                                <p className="text-sm font-medium text-success-800">{formData.documents.studentId.fileName}</p>
                                <p className="text-xs text-success-600">File uploaded successfully</p>
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
                  type="button"
                  className={buttonStyles({
                    color: "primary",
                    variant: "shadow",
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
