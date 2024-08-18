// Replace the import of prismadb as it's no longer needed
// import { prismadb } from "@/lib/prisma";

// Define the static expected revenue
const staticExpectedRevenue = 250000; // Example static revenue amount

// Update the getExpectedRevenue function to return the static revenue
export const getExpectedRevenue = async () => {
  return staticExpectedRevenue;
};
