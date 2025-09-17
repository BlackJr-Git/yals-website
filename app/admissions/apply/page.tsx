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
      allergies: "",
      medications: "",
      medicalConditions: "",
      specialNeeds: "",
    },
    educationHistory: {
      previousSchool: "",
      previousGrade: "",
      reasonForLeaving: "",
      hasSpecialEducation: false,
      specialEducationDetails: "",
    },

    // Étape 4: Documents et consentements
    mediaRelease: false,
    feeAcceptance: false,
    medicalAuthorization: false,
    documents: {
      birthCertificate: false,
      passportPhotos: false,
      schoolRecords: false,
      medicalRecords: false,
      identificationDocuments: false,
    },
    consentForm: false,
  });

  // Gestion des changements dans le formulaire
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
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
                    <SelectItem key="both-parents">
                      Both Parents
                    </SelectItem>
                    <SelectItem key="mother">
                      Mother Only
                    </SelectItem>
                    <SelectItem key="father">
                      Father Only
                    </SelectItem>
                    <SelectItem key="guardian">
                      Legal Guardian
                    </SelectItem>
                    <SelectItem key="himself">
                      Himself (18+ years old)
                    </SelectItem>
                    <SelectItem key="foster">
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
                  <SelectItem key="guardian">
                    Legal Guardian
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
                      <SelectItem key="guardian">
                        Legal Guardian
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
                        <SelectItem key="parent">
                          Parent
                        </SelectItem>
                        <SelectItem key="guardian">
                          Guardian
                        </SelectItem>
                        <SelectItem key="grandparent">
                          Grandparent
                        </SelectItem>
                        <SelectItem key="aunt-uncle">
                          Aunt/Uncle
                        </SelectItem>
                        <SelectItem key="sibling">
                          Sibling
                        </SelectItem>
                        <SelectItem key="family-friend">
                          Family Friend
                        </SelectItem>
                        <SelectItem key="nanny-babysitter">
                          Nanny/Babysitter
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
                  <SelectItem key="grandparent">
                    Grandparent
                  </SelectItem>
                  <SelectItem key="aunt-uncle">
                    Aunt/Uncle
                  </SelectItem>
                  <SelectItem key="sibling">
                    Adult Sibling
                  </SelectItem>
                  <SelectItem key="family-friend">
                    Family Friend
                  </SelectItem>
                  <SelectItem key="neighbor">
                    Neighbor
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
                  type="button"
                  className={buttonStyles({
                    color: "primary",
                    variant: "shadow",
                  })}
                  onClick={() => {
                    // Validation finale et soumission du formulaire
                    alert("Application submitted successfully!");
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
