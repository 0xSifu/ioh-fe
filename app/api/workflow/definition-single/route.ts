import { authOptions } from '@/lib/auth';
import { prismadb } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const ResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  global: z.record(z.string(), z.any()).optional(),
  definitionStatus: z.enum(['active', 'inactive']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  uiObject: z.object({
    react: z.object({
      nodes: z.array(z.any()),
      edges: z.array(z.any()),
    }),
  }),
});

export type ResponseSchemaType = z.infer<typeof ResponseSchema>;

export async function GET(
  req: Request,
  { params }: { params: { definitionId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!params.definitionId) {
    return new NextResponse("Definition ID is required", { status: 400 });
  }

  try {
    const definitions = await prismadb.definitions.findUnique({
      where: {
        id: params.definitionId,
      },
    })

    return NextResponse.json({definitions});
  } catch (error) {
    console.log("[DEFINITIONS_SINGLE_GET]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
