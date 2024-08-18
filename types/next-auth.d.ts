/* eslint-disable no-unused-vars */
import type { Session as NextAuthSession, User as NextAuthUser } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    accessToken?: string;
    refreshToken?: string;
    username?: string;
  }
}

declare module "next-auth" {
  interface User extends NextAuthUser {
    id: UserId;
    username?: string;
    email: string;
    lastLogin?: Date;
    isActive?: boolean;
    isDelete?: boolean;
    ipAddress?: string;
    log?: any;
    isAccountAdmin: boolean;
    isAdmin: boolean;
    userStatus: string;
    userLanguage: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session extends NextAuthSession {
    user: User;
  }
}
