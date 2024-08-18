import React, { Suspense } from "react";
import Container from "../components/ui/Container";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import WorkflowListView from "./components/WorkflowListView";
import SuspenseLoading from "@/components/loadings/suspense";

import { getDefinitionList } from "@/actions/workflows/get-definition-list";

export const maxDuration = 300;

const WorkflowsPage = async () => {

  const workflows = await getDefinitionList();

  const session: Session | null = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");

  return (
    <Container
      title="Workflows (WIP)"
      description={"Everything you need to know about workflows"}
    >
      <Suspense fallback={<SuspenseLoading />}>
        <WorkflowListView data={workflows} />
      </Suspense>
    </Container>
  );
};

export default WorkflowsPage;
