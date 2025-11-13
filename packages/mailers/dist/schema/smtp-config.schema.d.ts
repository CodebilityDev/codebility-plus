import "server-only";
import { z } from "zod";
export declare const SmtpConfigSchema: z.ZodObject<{
    user: z.ZodString;
    pass: z.ZodString;
    host: z.ZodString;
    port: z.ZodNumber;
    secure: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    user: string;
    pass: string;
    host: string;
    port: number;
    secure: boolean;
}, {
    user: string;
    pass: string;
    host: string;
    port: number;
    secure: boolean;
}>;
//# sourceMappingURL=smtp-config.schema.d.ts.map