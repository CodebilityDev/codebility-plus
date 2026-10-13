export interface AppointmentProps {
  formData: ContactFormData;
  onBack: () => void;
}

export interface InquiryFormProps {
  defaultValues: ContactFormData;
  onNext: (data: Pick<ContactFormData, "firstName" | "lastName" | "email" | "companyName" | "phoneNumber" | "industry">) => void;
}

export interface ContactFormData {
    // Step 1
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    phoneNumber: string;
    industry: string;
    // Step 2
    serviceInterest: string;
    projectType: string;
    featuresNeeded: string;
    referralSource: string;
    interestLevel: number;
    otherRequirements: string;
}

export interface ShortSurveyProps {
  defaultValues: ContactFormData;
  onNext: (data: Pick<ContactFormData, "serviceInterest" | "projectType" | "featuresNeeded" | "referralSource" | "interestLevel" | "otherRequirements">) => void;
  onBack: () => void;
}
