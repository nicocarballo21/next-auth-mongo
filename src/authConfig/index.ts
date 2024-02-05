/* eslint-disable @typescript-eslint/require-await */
import type {AuthOptions} from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import connectMongoDb from "@/lib/mongo/mongoConnection";
import User from "@/models/User";

const options: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      authorize: async (credentials) => {
        await connectMongoDb();

        if (!credentials) throw new Error("No credentials provided");

        try {
          const user = await User.findOne({
            email: credentials.email,
          });

          if (user) {
            return await user.comparePassword(credentials.password);
          }
        } catch (error) {
          return Response.json({error: "Invalid credentials"});
        }
      },
    }),
  ],
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({token, account}) {
      if (account) {
        token.accessToken = account.access_token;
        token.email = account.email as string;
      }

      return token;
    },
    async session({session, token}) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
  },
};

export default options;
