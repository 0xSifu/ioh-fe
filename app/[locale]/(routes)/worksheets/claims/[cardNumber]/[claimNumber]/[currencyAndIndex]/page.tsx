import React, { Suspense } from "react";
import Container from "@/app/[locale]/(routes)/components/ui/Container";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DetailWorksheetsView from "../../../../_components/DetailWorksheetsView";
import SuspenseLoading from "@/components/loadings/suspense";

export const maxDuration = 300;

const DetailPage = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");

  return (
    <Container
      title="Worksheets"
      description={"Everything you need to know about worksheets"}
    >
      <Suspense fallback={<SuspenseLoading />}>
        {/* <DetailWorksheetsView /> */}
      </Suspense>
    </Container>
  );
};

export default DetailPage;
