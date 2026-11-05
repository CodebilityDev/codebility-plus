import type { hireCodevEmailSchema } from "@/utils/global/hire-codev-email";
import type { z } from "zod";

export type HireCodevEmail = z.infer<typeof hireCodevEmailSchema>;
