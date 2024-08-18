// Replace the import of prismadb as it's no longer needed
// import { prismadb } from "@/lib/prisma";

// Define the static count for contacts
const staticContactCount = 300; // Example static count

// Update the getContactCount function to return the static count
export const getContactCount = async () => {
  return staticContactCount;
};
