import "server-only";
import { getSMTPConfiguration } from "../../smtp-configuration";
/**
 * A class representing a mailer using Nodemailer library.
 * @implements {Mailer}
 */
export class Nodemailer {
    async sendEmail(config) {
        const { createTransport } = await import("nodemailer");
        const transporter = createTransport(getSMTPConfiguration());
        return transporter.sendMail(config);
    }
}
