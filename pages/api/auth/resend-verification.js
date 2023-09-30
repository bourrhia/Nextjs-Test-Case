// pages/api/resend-verification.js
//import { resendVerificationEmail } from '../../utils/email';
import { connectToDatabase } from "../../../util/mongodb";
import { sendVerificationEmail } from "../../../lib/email/sendVerificationEmail";
//import { verificationTokenUpdate } from "../../../lib/token/verificationTokenUpdate";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      // const db = await connectToDatabase();
      // const users = db.collection('users');

      const { db } = await connectToDatabase();
      //const existingUser = await db.collection("user").findOne({ email });

      // Check if the user already exists
      const user = await db.collection("user").findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Generate a new verification token and resend the email
      const newToken = uuidv4();

      //
      // const newToken = generateNewVerificationToken(); // Implement your token generation logic
      await db
        .collection("user")
        .updateOne(
          { _id: user._id },
          { $set: { verificationToken: newToken } }
        );

      /* await users.updateOne(
        { _id: user._id },
        { $set: { verificationToken: newToken } }
      );*/

      // Call the resendVerificationEmail function
      // await resendVerificationEmail(email, newToken, process.env.NEXT_PUBLIC_APP_URL);
      // Send verification email
      await sendVerificationEmail(email, newToken);
      console.log("Reverification email sent successfully");

      return res.status(200).json({ message: "Verification email resent." });
    } catch (error) {
      console.error("Error resending verification email:", error);
      return res
        .status(500)
        .json({ error: "Failed to resend verification email." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
