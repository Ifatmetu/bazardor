import dns from "node:dns";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(process.env.MONGO_DB_URL as string);

globalForMongo.mongoClient = client;

const db = client.db("bazardor");

export const auth = betterAuth({
  database: mongodbAdapter(db), // no `client`, so no transactions

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
});