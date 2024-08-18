// Replace the import of prismadb as it's no longer needed
// import { prismadb } from "@/lib/prisma";

// Define the static count for invoices
const staticInvoicesCount = 88; // Example static count

// Update the getInvoicesCount function to return the static count
export const getInvoicesCount = async () => {
  return staticInvoicesCount;
};
