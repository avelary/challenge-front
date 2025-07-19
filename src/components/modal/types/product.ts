import { z } from "zod";
import { productSchema } from "../schemas/productSchema";

/**
 * Parsed product data after Zod validation and transformation.
 */
export type ProductFormData = z.infer<typeof productSchema>;

/**
 * Raw form input format before Zod parsing (typically coming from form inputs as strings).
 */
export type ProductFormInput = Omit<
  ProductFormData,
  "price" | "quantity" | "offer" | "idca" | "idcl" | "idPartner" | "idPrinter"
> & {
  price: string;
  quantity: string | null;
  offer: string;
  idca: string;
  idcl: string;
  idPartner: string;
  idPrinter: string | null;
};