import { z } from "zod";

export const codevIdSchema = z.string().uuid("Invalid codev ID format");
