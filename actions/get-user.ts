import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const getUser = async () => {
  const session = await getServerSession(authOptions);
  console.log("Session : ",session);
  
  
  if (!session) throw new Error("User not found");
  return session.user;
};
