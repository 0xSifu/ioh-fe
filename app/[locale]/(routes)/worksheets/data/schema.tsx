import { z } from "zod";

// Updated schema where assigned_user is an array of objects
export const worksheetSchema = z.object({
  id: z.number(),
  dob: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  insuranceNumber: z.string(),
  polisNumber: z.string(),
  memberNumber: z.string(),
  cardNumber: z.string(),
  memberName: z.string(),
  plafon: z.number(),
  paid: z.number(),
  noPks: z.string(),
  claimStatus: z.number(),
  limitAvailable: z.number(),
  dateBegin: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  dateEnd: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  claimNo: z.string(),
  customerName: z.string(),
  customerCode: z.string(),
  holdingName: z.string(),
  holdingCode: z.string(),
  planDetailCode: z.string(),
  planNameDetail: z.string(),
  paketCode: z.string(),
  paketName: z.string(),
  providerCode: z.string(),
  providerName: z.string(),
  claimDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  admisionDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  dischargeDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  claimType: z.string(),
  remark: z.string(),
  totalPaid: z.number(),
  totalExcess: z.number(),
  totalClaim: z.number(),
  lastStatus: z.string()
});

export type Worksheet = z.infer<typeof worksheetSchema>;


