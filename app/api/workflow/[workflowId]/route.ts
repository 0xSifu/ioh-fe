import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prismadb } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

//Contact delete route
export async function DELETE(
  req: Request,
  { params }: { params: { definitionId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!params.definitionId) {
    return new NextResponse("Workflow ID is required", { status: 400 });
  }

  try {
    await prismadb.definitions.delete({
      where: {
        id: params.definitionId,
      },
    });

    return NextResponse.json({ message: "Workflow Definition Deleted" }, { status: 200 });
  } catch (error) {
    console.log("[WORKFLOW_DELETE]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
