import { z } from "zod";

export const productSchema = z.object({
  status: z.string().default("pending"),

  title: z
    .string()
    .trim()
    .min(6, "Title must have at least 6 characters.")
    .max(100, "Title must have at most 100 characters."),

  productType: z
    .string()
    .trim()
    .min(4, "Product type must have at least 6 characters.")
    .max(15, "Product type must have at most 15 characters."),

  idca: z
    .string()
    .min(1, "Mensure must be selected")
    .refine((val) => !isNaN(Number(val)), "idca must be a number")
    .transform(Number),

  idcl: z
    .string()
    .min(1, "Mensure must be selected")
    .refine((val) => !isNaN(Number(val)), "idcl must be a number")
    .transform(Number),

  idPartner: z
    .string()
    .refine((val) => !isNaN(Number(val)), "idPartner must be a number")
    .transform(Number),


  idPrinter: z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === "" || val === null || !isNaN(Number(val)), {
      message: "idPrinter must be a number",
    })
    .transform((val) => (val === "" || val === null ? null : Number(val))),

  image: z.string().optional().nullable(),

  measure: z
    .string()
    .trim()
    .min(1, "Mensure must be selected")
    .max(3, "Measure must have at most 3 characters."),

  quantity: z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || val === "" || !isNaN(Number(val)), {
      message: "Quantity must be a number",
    })
    .transform((val) => {
      if (!val || val === "") return null;
      return Number(val.replace(/\./g, "").replace(",", "."));
    }),

  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Price must be a number")
    .transform((val) => Number(val.replace("R$", "").replace(",", "."))),

  offer: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Offer must be a number")
    .transform((val) => Number(val.replace("R$", "").replace(",", "."))),

  description: z.string().max(255).optional().nullable(),
  remove: z.string().optional().nullable(),
  include: z.string().optional().nullable(),
  datasheet: z.string().optional().nullable(),
});


