// Replace the import of prismadb as it's no longer needed
// import { prismadb } from "@/lib/prisma";

// Define static document sizes in bytes
const staticDocuments = [
  { size: 500000 }, // Example sizes in bytes
  { size: 1500000 },
  { size: 250000 },
];

// Calculate static storage size
const calculateStaticStorageSize = (documents: { size: number }[]) => {
  const storageSize = documents.reduce((acc: number, doc) => {
    return acc + doc.size;
  }, 0);

  const storageSizeMB = storageSize / 1000000;
  return Math.round(storageSizeMB * 100) / 100;
};

// Update the getStorageSize function to return the static storage size
export const getStorageSize = async () => {
  return calculateStaticStorageSize(staticDocuments);
};
