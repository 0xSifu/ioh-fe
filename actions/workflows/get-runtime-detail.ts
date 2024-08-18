import { prismadb } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from 'zod';

const ResponseSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  workflowStatus: z.enum(['pending', 'completed', 'failed']),
  definitions: z.object({
    id: z.string(),
    name: z.string(),
    definitionStatus: z.enum(['active', 'inactive']),
    description: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
  logs: z.array(
    z.object({
      timestamp: z.string().datetime(),
      taskName: z.string(),
      log: z.string(),
      severity: z.enum(['log', 'info', 'warn', 'error']),
    })
  ),
  tasks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      next: z.array(z.string()),
      previous: z.array(z.string()),
      params: z.record(z.string(), z.any()).optional(),
      exec: z.string().optional(),
      type: z.enum(['FUNCTION', 'WAIT', 'START', 'END', 'LISTEN', 'GUARD']),
      status: z.enum(['pending', 'completed', 'started', 'failed']),
    })
  ),
  workflowResults: z.record(z.string(), z.any()).optional(),
});

export type ResponseSchemaType = z.infer<typeof ResponseSchema>;

export const getRuntimeDetail = async (runtimeId: string) => {
  const data = await prismadb.runtimes.findUnique({
    where: {
        id: runtimeId,
      },
      include: {
        definitions: {
          select: {
            id: true,
            name: true,
            definitionStatus: true,
            description: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  return ResponseSchema.parse(data);
};