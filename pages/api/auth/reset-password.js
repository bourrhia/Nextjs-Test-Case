import { connectToDatabase } from "../../../util/mongodb";
import { hashPassword } from "../../../helpers/auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, resetCode, password } = req.body;

    // const { db } = await connectToDatabase();

    // Hash the password
    const hashedNewPassword = await hashPassword(password);

    // Verify the reset code
    const resetCodeIsValid = await verifyResetCode(email, resetCode);

    if (resetCodeIsValid) {
      // Update the user's password
      await updatePassword(email, hashedNewPassword);

      // Remove the used reset code
      await clearResetCode(email);

      res.status(200).json({ message: "Password reset successful." });
    } else {
      res.status(400).json({ message: "Invalid reset code" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

async function verifyResetCode(email, resetCode) {
  // Implement your code verification logic here
  // Query your database to check if the reset code is valid for the given email
  // Return true if the reset code is valid, otherwise return false

  try {
    // Connect to your database
    const { db } = await connectToDatabase();
    //const usersCollection = db.collection("users");

    // Find the user by email and check if the reset code matches
    //const user = await usersCollection.findOne({ email: email, resetCode: resetCode });
    const user = await db
      .collection("user")
      .findOne({ email: email, resetCode: resetCode });

    if (user) {
      // Reset code matches, return true
      return true;
    } else {
      // Reset code doesn't match, return false
      return false;
    }
  } catch (error) {
    // Handle database connection or query errors
    console.error("Error verifying reset code:", error);
    throw new Error("Failed to verify reset code.");
  }
}

async function updatePassword(email, hashedNewPassword) {
  // Implement your password update logic here
  // Update the user's password in your database
  try {
    // Connect to your database
    const { db } = await connectToDatabase();
    //const usersCollection = db.collection("users");

    // Update the user's password based on their email
    await db
      .collection("user")
      .updateOne({ email: email }, { $set: { password: hashedNewPassword } });

    // Password updated successfully
    return true;
  } catch (error) {
    // Handle database connection or update errors
    console.error("Error updating password:", error);
    throw new Error("Failed to update password.");
  }
}

async function clearResetCode(email) {
  // Implement logic to clear the reset code in your database
  try {
    // Connect to your database
    const { db } = await connectToDatabase();
    //const usersCollection = db.collection("users");

    // Clear the reset code for the user based on their email
    await db
      .collection("user")
      .updateOne({ email: email }, { $unset: { resetCode: "" } });

    // Reset code cleared successfully
    return true;
  } catch (error) {
    // Handle database connection or update errors
    console.error("Error clearing reset code:", error);
    throw new Error("Failed to clear reset code.");
  }
}
