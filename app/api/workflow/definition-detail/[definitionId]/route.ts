import { authOptions } from '@/lib/auth';
import { prismadb } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

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
      select: {
        id: true,
        name: true,
        description: true,
        definitionStatus: true,
        createdAt: true,
        updatedAt: true,
        runtimes: {
          select: {
            id: true,
            workflowStatus: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
    })

    return NextResponse.json({definitions});
  } catch (error) {
    console.log("[DEFINITIONS_DETAIL_GET]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
