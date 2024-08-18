// Replace the import of prismadb as it's no longer needed
// import { prismadb } from "@/lib/prisma";

// Define the static count for documents
const staticDocumentsCount = 150; // Example static count

// Update the getDocumentsCount function to return the static count
export const getDocumentsCount = async () => {
  return staticDocumentsCount;
};
