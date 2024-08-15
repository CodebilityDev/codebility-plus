import { z } from 'zod';

const MAILER_PROVIDER = z
  .enum(['nodemailer', 'cloudflare', 'resend'])
  .default('nodemailer')
  .parse(process.env.MAILER_PROVIDER);