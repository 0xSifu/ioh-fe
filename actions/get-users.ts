import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/interfaces/user";

// Get all users for admin module
export const getUsers = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;

  if (!user) {
    return [];
  }

  return [user];
};

// Get active users for selects in app etc
export const getActiveUsers = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;

  if (!user || user.userStatus !== "ACTIVE") {
    return [];
  }

  return [user];
};

// Get new users by month and year for chart
export const getUsersByMonthAndYear = async (year: number) => {
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;

  if (!user) {
    return [];
  }

  const usersByMonth: { [key: string]: number } = {};
  const yearCreated = new Date(user.created_on).getFullYear();
  const month = new Date(user.created_on).toLocaleString("default", { month: "long" });

  if (yearCreated === year) {
    usersByMonth[month] = (usersByMonth[month] || 0) + 1;
  }

  const chartData = Object.keys(usersByMonth).map((month) => ({
    name: month,
    Number: usersByMonth[month],
  }));

  return chartData;
};

// Get new users by month for chart
export const getUsersByMonth = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;

  if (!user) {
    return [];
  }

  const usersByMonth: { [key: string]: number } = {};
  const month = new Date(user.created_on).toLocaleString("default", { month: "long" });

  usersByMonth[month] = (usersByMonth[month] || 0) + 1;

  const chartData = Object.keys(usersByMonth).map((month) => ({
    name: month,
    Number: usersByMonth[month],
  }));

  return chartData;
};
