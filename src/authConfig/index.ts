/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/require-await */
import type {AuthOptions} from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

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
            const isValid = await user.comparePassword(credentials.password);

            const jsonUser = user.toAuthJson();

            if (isValid) return jsonUser;
            else return null;
          }
        } catch (error) {
          console.log(error, "error");

          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({token, user}) {
      token.user = user;

      return token;
    },

    async session({session, token}) {
      session.user = token;

      return session;
    },

    async signIn({user, account}) {
      if (account?.provider === "credentials") return true;

      if (account?.provider === "github") {
        await connectMongoDb();

        try {
          const existingUser = await User.findOne({email: user.email!});

          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              name: user.name,
              password: "",
            });

            await newUser.save();

            return true;
          }

          return true;
        } catch (error) {
          console.log(error, "error");

          return false;
        }
      }

      return false;
    },
  },
};

export default options;
