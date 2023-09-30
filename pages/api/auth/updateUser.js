import { connectToDatabase } from "../../../util/mongodb";
import { hashPassword } from "../../../helpers/auth";

export default async function signupHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, nom, prenom, password } = req.body;

  try {
    const { db } = await connectToDatabase();

    // Check if the user already exists
    const existingUser = await db.collection("user").findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
      //return res.status(200).json({ message: "User not found" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const tokenExpirationTime = new Date();
    tokenExpirationTime.setHours(tokenExpirationTime.getHours() + 24); // Token expiration time of 24 hours

    const updatedUser = await db.collection("user").updateOne(
      { email },
      {
        $set: {
          email: email,
          nom: nom,
          prenom: prenom,
          password: hashedPassword,
          verified: false,
          verificationToken: "",
          verificationTokenExpirationTime: tokenExpirationTime,
        },
      }
    );

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    //await db.close();
  }
}
