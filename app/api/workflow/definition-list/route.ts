import { authOptions } from '@/lib/auth';
import { prismadb } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  try {
    const definitions = await prismadb.definitions.findMany({})

    return NextResponse.json({definitions});
  } catch (error) {
    console.log("[DEFINITIONS_LIST_GET]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
