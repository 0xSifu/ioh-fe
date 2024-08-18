import { prismadb } from "@/lib/prisma";
import { z } from 'zod';

const ResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  global: z.record(z.string(), z.any()).optional(),
  definitionStatus: z.enum(['active', 'inactive']),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  uiObject: z.object({
    react: z.object({
      nodes: z.array(z.any()),
      edges: z.array(z.any()),
    }),
  }),
});

export type ResponseSchemaType = z.infer<typeof ResponseSchema>;

export const getDefinitionSingle = async (definitionId: string) => {
  const data = await prismadb.definitions.findUnique({
    where: {
      id: definitionId,
    },
  });
  return ResponseSchema.parse(data);
};