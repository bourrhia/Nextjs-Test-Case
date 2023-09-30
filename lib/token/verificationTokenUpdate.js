import { connectToDatabase } from "../../util/mongodb";

export async function verificationTokenUpdate({ email, verificationToken }) {
  try {
    const { db } = await connectToDatabase();

    // Update the user's verification token in the database
    await db
      .collection("user")
      .updateOne(
        { email: email },
        { $set: { verificationToken: verificationToken } }
      );

    console.log("User updated successfully.");
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    // Close the database connection
    // await db.close();
  }
}
