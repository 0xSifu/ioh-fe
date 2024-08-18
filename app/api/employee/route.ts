import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const body = await req.json();
  const userId = session?.user.id;

  const { 
    firstName, 
    lastName, 
    email, 
    position, 
    phone, 
    salary, 
    onBoarding, 
    IBAN,
    taxid,
    address,
    insurance 
  } = body;
  
  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!firstName) {
    return new NextResponse("Missing first name", { status: 400 });
  }

  if (!email) {
    return new NextResponse("Missing  email", { status: 400 });
  }

  try {

    const newEmployee = await prismadb.employee.create({
      data: {
        createdBy: userId,
        updatedBy: userId,
        firstName: firstName, 
        lastName, 
        email,
        position,
        phone, 
        salary, 
        onBoarding, 
        IBAN,
        taxid,
        address,
        insurance
      },
    });

    return NextResponse.json({ newEmployee }, { status: 200 });
  } catch (error) {
    console.log("[NEW_EMPLOYEE_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }

}

//Update route
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }
  try {
    const body = await req.json();
    const userId = session.user.id;

    if (!body) {
      return new NextResponse("No form data", { status: 400 });
    }

    const {
      id,
      firstName,
      lastName,
      email,
      position,
      phone,
      salary,
      onBoarding,
      IBAN,
      taxid,
      address,
      insurance
    } = body;

    const updateEmployee = await prismadb.employee.update({
      where: {
        id,
      },
      data: {
        updatedBy: userId,        
        firstName,
        lastName,
        email,
        position,
        phone,
        salary,
        onBoarding,
        IBAN,
        taxid,
        address,
        insurance
      },
    });

    return NextResponse.json({ updateEmployee }, { status: 200 });
  } catch (error) {
    console.log("UPDATE_EMPLOYEE_PUT]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}