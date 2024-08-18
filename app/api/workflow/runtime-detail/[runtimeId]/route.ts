import { authOptions } from '@/lib/auth';
import { prismadb } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { runtimeId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!params.runtimeId) {
    return new NextResponse("Runtime ID is required", { status: 400 });
  }

  try {
    const runtime = await prismadb.runtimes.findUnique({
      where: {
        id: params.runtimeId,
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
      },
    })

    return NextResponse.json({runtime});
  } catch (error) {
    console.log("[RUNTIME_DETAIL_GET]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
