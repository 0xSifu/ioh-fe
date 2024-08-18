// Replace the import of prismadb as it's no longer needed
// import { prismadb } from "@/lib/prisma";

// Define the static count for workflows
const staticWorkflowCount = 50; // Example static count

// Update the getWorkflowCount function to return the static count
export const getWorkflowCount = async () => {
  return staticWorkflowCount;
};
