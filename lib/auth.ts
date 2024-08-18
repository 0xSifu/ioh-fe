import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/interfaces/user";

function getCredentials() {
  return {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Define your login request
        const response = await fetch("http://localhost:9001/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await response.json();

        if (response.ok && data.data) {
          const { accessToken, refreshToken, user } = data.data;

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            accessToken: accessToken ?? "",
            refreshToken: refreshToken ?? "",
            isActive: user.isActive ?? false,
            isAccountAdmin: user.isAccountAdmin,
            isAdmin: user.isAdmin,
            userStatus: user.userStatus,
            userLanguage: user.userLanguage,
          } as User;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.isActive = user.isActive;
        token.isAccountAdmin = user.isAccountAdmin;
        token.isAdmin = user.isAdmin;
        token.userStatus = user.userStatus;
        token.userLanguage = user.userLanguage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          lastLogin: token.lastLogin as Date,
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
          isActive: token.isActive as boolean,
          isAccountAdmin: token.isAccountAdmin as boolean,
          isAdmin: token.isAdmin as boolean,
          userStatus: token.userStatus as string,
          userLanguage: token.userLanguage as string,
        } as User;
      }
      return session;
    },
  },
};
