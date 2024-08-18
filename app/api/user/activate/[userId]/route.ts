import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sendEmail from "@/lib/sendmail";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  try {
    const user = await prismadb.users.update({
      where: {
        id: params.userId,
      },
      data: {
        userStatus: "ACTIVE",
      },
    });

    let message;

    switch (user.userLanguage) {
      case "en":
        message = `Your account has been activated in ${process.env.NEXT_PUBLIC_APP_NAME}. \n\n Your username is: ${user.email} \n\n Please login to ${process.env.NEXT_PUBLIC_APP_URL} \n\n Thank you \n\n ${process.env.NEXT_PUBLIC_APP_NAME}`;
        break;
      case "de":
        message = `Ihr Konto wurde aktiviert ${process.env.NEXT_PUBLIC_APP_NAME}. \n\n Dein Benutzername ist: ${user.email} \n\n  Bitte melden Sie sich an ${process.env.NEXT_PUBLIC_APP_URL} \n\n Danke \n\n ${process.env.NEXT_PUBLIC_APP_NAME}`;
        break;
      default:
        message = `You account has been activated in ${process.env.NEXT_PUBLIC_APP_NAME} \n\n Your username is: ${user.email} \n\n Please login to ${process.env.NEXT_PUBLIC_APP_URL} \n\n Thank you \n\n ${process.env.NEXT_PUBLIC_APP_NAME}`;
        break;
    }

    await sendEmail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Invitation to ${process.env.NEXT_PUBLIC_APP_NAME}`,
      text: message,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_ACTIVATE_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
