import { connectToDatabase } from "../../../../util/mongodb";
import { sendResetCodeByEmail } from "../../../../lib/email/sendResetCodeByEmail";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // const { email } = req.body;
    const { email } = req.query;

    //console.log("Lundi on server Reset code generate:", email);

    try {
      // Store the reset code in the database (MongoDB)
      const { db } = await connectToDatabase();
      // const user = db.collection("user");

      // Check if the user already exists
      const user = await db.collection("user").findOne({ email: email });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Generate a reset code
      const resetCode = generateResetCode();

      //console.log("email server :", email);
      //console.log("reset code : ", resetCode);

      await db
        .collection("user")
        .updateOne({ email: email }, { $set: { resetCode: resetCode } });

      // Send the reset code via email
      await sendResetCodeByEmail(email, resetCode);

      //console.log("Reset code sent successfully");

      return res.status(200).json({ message: "Reset code sent successfully." });
    } catch (error) {
      console.error("Error resending Reset code:", error);
      return res.status(500).json({ error: "Failed to send Reset code." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}

function generateResetCode() {
  //return Math.random().toString(36).substring(7);
  //////
  const codeLength = 6; // Adjust the desired length of your reset code
  const min = Math.pow(10, codeLength - 1); // Minimum value
  const max = Math.pow(10, codeLength) - 1; // Maximum value
  const resetCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return resetCode.toString();
}
