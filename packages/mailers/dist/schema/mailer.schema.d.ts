import { z } from "zod";
export declare const MailerSchema: z.ZodIntersection<z.ZodObject<{
    to: z.ZodString;
    from: z.ZodString;
    subject: z.ZodString;
}, "strip", z.ZodTypeAny, {
    to: string;
    from: string;
    subject: string;
}, {
    to: string;
    from: string;
    subject: string;
}>, z.ZodUnion<[z.ZodObject<{
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
}, {
    text: string;
}>, z.ZodObject<{
    html: z.ZodString;
}, "strip", z.ZodTypeAny, {
    html: string;
}, {
    html: string;
}>]>>;
//# sourceMappingURL=mailer.schema.d.ts.map