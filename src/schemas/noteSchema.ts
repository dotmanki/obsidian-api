import { z } from "zod";

export const noteSchema = z.object({
  body: z.object({
    numero: z.string({
      required_error: "El numero es requerido",
    }),
  }),
});
