// Replace the import of prismadb as it's no longer needed
// import { prismadb } from "@/lib/prisma";

// Define the static count for active users
const staticActiveUsersCount = 120; // Example static count

// Update the getActiveUsersCount function to return the static count
export const getActiveUsersCount = async () => {
  return staticActiveUsersCount;
};
