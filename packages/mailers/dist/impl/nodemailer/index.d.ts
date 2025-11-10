import "server-only";
import { z } from "zod";
import { Mailer } from "../../mailer";
import { MailerSchema } from "../../schema/mailer.schema";
type Config = z.infer<typeof MailerSchema>;
/**
 * A class representing a mailer using Nodemailer library.
 * @implements {Mailer}
 */
export declare class Nodemailer implements Mailer {
    sendEmail(config: Config): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
export {};
//# sourceMappingURL=index.d.ts.map