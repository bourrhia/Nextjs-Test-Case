import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../util/mongodb";
import clientPromise from "../../../util/authMongodb";
import { sendVerificationEmail } from "../../../lib/email/sendVerificationEmail";
import { verificationTokenUpdate } from "../../../lib/token/verificationTokenUpdate";
import { v4 as uuidv4 } from "uuid";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    Email({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({
        identifier: email,
        url,
        token,
        provider: { server, from },
      }) {
        try {
          // Generate a verification token
          const verificationToken = uuidv4();

          // Update the user in your database with the verification token
          await verificationTokenUpdate({
            email,
            verificationToken,
          });

          // Send verification email
          await sendVerificationEmail(email, verificationToken);
          console.log("Verification email sent successfully");
        } catch (error) {
          console.error("Error sending verification email:", error);
        }

        //return true;
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        // username: { label: "Username", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { db } = await connectToDatabase();

          const user = await db
            .collection("user")
            // .findOne({ username: credentials.username });
            .findOne({ email: credentials.email });

          if (!user) {
            // return null;
            return Promise.resolve(null);
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            // return null;
            return Promise.resolve(null);
          }

          return {
            // id: user._id.toString(),
            id: user.userId,
            email: user.email,
            lastname: user.nom,
            firstname: user.prenom,
          };
        } catch (error) {
          console.error(error);
          //return error;
          return Promise.resolve(null);
        }
      },
    }),
  ],
  session: {
    jwt: true,
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  database: process.env.MONGODB_URI,
  //adapter: MongoDBAdapter(connectToDatabase),
  adapter: MongoDBAdapter(clientPromise),

  // adapter: adapter,

  callbacks: {
    async signIn(user, account, profile) {
      console.log("fire signin Callback", user);
      return true;
    },

    // Handle authentication errors

    /* async signInError(error, _redirect) {
      // Log the error for debugging purposes

      console.error("Authentication error:", error);
      // console.log("Authentication error:", error);
      console.log("Authentication error:", { error });
      if (error === "CredentialsSignin") {
        // Handle the "CredentialsSignin" error specifically
        return {
          error:
            "Les informations saisies ne correspondent pas. Votre mot de passe est incorrect.",
        };
      } else {
        // Handle other errors with a generic message
        return { error: "Authentification échouée. Veuillez réessayer." };
      }
    },*/

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },

    async jwt({ token, user, account, profile }) {
      // console.log("JWT callback - Initial Token:", token);

      if (account) {
        token.account = account;
      }
      if (profile) {
        token.profile = profile;
      }

      if (user) {
        // console.log("JWT callback - User:", token.user);
        token.id = user.id;
        token.email = user.email;
        token.lastname = user.lastname;
        token.firstname = user.firstname;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        // console.log("Session callback User :", token.token.user.email);
        console.log("Session token 2023 :", token);

        const id = token.id;
        const email = token.email;
        const lastname = token.lastname;
        const firstname = token.firstname;

        // Assign the extracted fields to the session
        session.user = {
          id,
          email,
          lastname,
          firstname,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    //signUp: "/signUpForm",
    //verifyRequest: "/auth/verify-request",
    // verifyRequest: "/auth/verify-request?email=:email",
  },
});
