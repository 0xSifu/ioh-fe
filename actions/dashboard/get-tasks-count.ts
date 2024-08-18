// Replace the import of prismadb as it's no longer needed
// import { prismadb } from "@/lib/prisma";

// Define static values for tasks count
const staticTasksCount = 150;
const staticUserTasksCount = (userId: string) => {
  // You can add logic here to return different counts based on userId if needed
  return 25; // Example static count for any user
};

// Update the getTasksCount function to return the static count
export const getTasksCount = async () => {
  return staticTasksCount;
};

// Update the getUsersTasksCount function to return a static count
export const getUsersTasksCount = async (userId: string) => {
  return staticUserTasksCount(userId);
};
