import { prismadb } from "@/lib/prisma";

export const getWorkflowsData = async (definitionId: string) => {
  const data = await prismadb.definitions.findFirst({
    where: {
      id: definitionId,
    },     
  });
  return data;
};
