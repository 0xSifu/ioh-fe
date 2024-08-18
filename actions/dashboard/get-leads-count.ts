// Replace the import of prismadb as it's no longer needed
// import { prismadb } from "@/lib/prisma";

// Define the static count
const staticLeadsCount = 100;

// Update the getLeadsCount function to return the static count
export const getLeadsCount = async () => {
  return staticLeadsCount;
};
