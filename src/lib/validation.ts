import { date, success, z } from "zod";

export const paymentSchema = z
  .object({
    email: z
      .string()
      .transform((value) => value.trim().toLowerCase())
      .refine(
        (value) => /^[^@\s]+@[^@\s]+$/.test(value),
        "Enter a valid email",
      ),

    sku: z.enum(["lamp", "stool"], {
      error: "Choose an item",
    }),

    externalChargeId: z
      .string()
      .regex(/^ch_[A-Za-z0-9]{8,}$/, "Enter a charge id like ch_12345678"),

    extraCode: z.string().nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.extraCode !== undefined &&
      value.extraCode !== null &&
      (value.extraCode !== "cushion" || value.sku !== "stool")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["extraCode"],
        message: "That extra is not sold with this item",
      });
    }
  });

export function validatePayment(input: unknown) {
  const result = paymentSchema.safeParse(input);

  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0]);

      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
    return {
      success: false as const,
      errors,
    };
  }
  return {
    success: true as const,
    data: {
      ...result.data,
      extraCode: result.data.extraCode ?? null,
    },
  };
}
