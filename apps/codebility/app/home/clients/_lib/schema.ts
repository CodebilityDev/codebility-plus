import * as z from "zod";

const fileSchema = z.custom<File>((val) => val instanceof File, {
  message: "Must be a File object",
});

export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.union([z.string().email("Invalid email"), z.literal("")]),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  website: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  company_logo: z.union([fileSchema, z.string()]).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  industry: z.string().optional(),
  client_type: z.string().optional(),
  country: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export type ClientWithStatusFormValues = ClientFormValues & {
  status: "active" | "inactive";
};

export type FormItems = {
  labelText: string;
  placeHolderText: string;
  inputType?: string;
  formDefaultValue: string;
  options?: { value: string; label: string }[];
};

export const getFormItemLabels = (
  country: { value: string; label: string }[],
): FormItems[] => [
  {
    labelText: "Name",
    placeHolderText: "Enter Company Name",
    inputType: "text",
    formDefaultValue: "name",
  },
  {
    labelText: "Email",
    placeHolderText: "Enter Company Email Address",
    inputType: "email",
    formDefaultValue: "email",
  },
  {
    labelText: "Address",
    placeHolderText: "Enter Company Address",
    inputType: "text",
    formDefaultValue: "address",
  },
  {
    labelText: "Website",
    placeHolderText: "https://example.com",
    inputType: "url",
    formDefaultValue: "website",
  },
  {
    labelText: "Client Type",
    placeHolderText: "Select client type",
    formDefaultValue: "client_type",
    options: [
      { value: "individual", label: "Individual" },
      { value: "organization", label: "Organization" },
    ],
  },
  {
    labelText: "Country",
    placeHolderText: "Select a country",
    formDefaultValue: "country",
    options: country, // Pass the latest country data
  },
  {
    labelText: "Phone Number",
    placeHolderText: "Enter Company Phone Number",
    inputType: "tel",
    formDefaultValue: "phone_number",
  },
];
