import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prismadb } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

//Contact delete route
export async function DELETE(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!params.employeeId) {
    return new NextResponse("Employee ID is required", { status: 400 });
  }

  try {
    await prismadb.employee.delete({
      where: {
        id: params.employeeId,
      },
    });

    return NextResponse.json({ message: "Employee Deleted" }, { status: 200 });
  } catch (error) {
    console.log("[EMPLOYEE_DELETE]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
