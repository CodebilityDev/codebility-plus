import { z } from "zod";

const PathsSchema = z.object({
    auth: z.object({
      signIn: z.string().min(1),
      signUp: z.string().min(1),
      callback: z.string().min(1),
      passwordReset: z.string().min(1),
    }),
    app: z.object({
      home: z.string().min(1),
      cards: z.string().min(1)
    }),
});

const pathsConfig = PathsSchema.parse({
    auth: {
      signIn: '/auth/sign-in',
      signUp: '/auth/sign-up',
      callback: '/auth/callback',
      passwordReset: '/auth/password-reset'
    },
    app: {
      home: '/home',
      cards: "/home/cards"
    },
  } satisfies z.infer<typeof PathsSchema>);
  
  export default pathsConfig;