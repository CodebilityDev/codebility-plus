import * as z from "zod";

const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
const socialsRegex = /^https?:\/\/(www\.)?(github|facebook|linkedin|telegram|whatsapp|skype)\.com\/[a-zA-Z0-9-_]+$/

const createValidator = (regex: RegExp, errorMessage: string) => {
    return z.string().refine(value => regex.test(value), {
        message: errorMessage,
    }).optional();
};

export const contactInfoValidation = z.object({
    phone_no: createValidator(phoneRegex, "Invalid phone number format"),
    portfolio_website: z.string().url().optional(),
    github_link: createValidator(socialsRegex, "Invalid GitHub link format"),
    fb_link: createValidator(socialsRegex, "Invalid Facebook link format"),
    linkedin_link: createValidator(socialsRegex, "Invalid LinkedIn link format"),
    telegram_link: createValidator(socialsRegex, "Invalid Telegram link format"),
    whatsapp_link: createValidator(socialsRegex, "Invalid WhatsApp link format"),
    skype_link: createValidator(socialsRegex, "Invalid Skype link format"),
});

export type contactInfoValidationSchema = z.infer<typeof contactInfoValidation>