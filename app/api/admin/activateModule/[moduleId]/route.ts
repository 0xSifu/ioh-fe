import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getModules } from "@/actions/get-modules";

export async function POST(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  try {
    const modules = await getModules();

    const foundModule = modules.find(module => module.name === params.moduleId);

    if (!foundModule) {
      return new NextResponse("Module not found", { status: 404 });
    }

    // Create a new object with the updated properties
    const updatedModule = {
      ...foundModule,
      enabled: true,
    };

    return NextResponse.json(updatedModule);
  } catch (error) {
    console.log("[MODULEACTIVATE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
