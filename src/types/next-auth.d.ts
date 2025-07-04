// import NextAuth from "next-auth"
import "next-auth";

declare module "next-auth" {
  interface User {
    login: string;
  }

  interface Session {
    user: User & {
        login: string
    }
    token: {
        login: string
    }
  }
}