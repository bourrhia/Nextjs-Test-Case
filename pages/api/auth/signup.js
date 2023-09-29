import { connectToDatabase } from "../../../util/mongodb";
import { hashPassword } from "../../../helpers/auth";
//import { sendVerificationEmail } from "../../../lib/email/sendVerificationEmail";
//import { v4 as uuidv4 } from "uuid";

export default async function signupHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, nom, prenom, password } = req.body;

  try {
    // Connect to the MongoDB database
    // const client = await connectToDatabase();
    // const usersCollection = client.db().collection("user");

    const { db } = await connectToDatabase();
    //const existingUser = await db.collection("user").findOne({ email });

    // Check if the user already exists
    const existingUser = await db.collection("user").findOne({ email });
    if (existingUser) {
      return (
        res
          .status(422)
          //.status(200)
          .json({ message: "User found" })
      );
      /* return (
        res
          //.status(422)
          .status(200)
          .json({ message: "L'adresse e-mail est déjà associée à un compte" })
      );*/
      //return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Generate a verification token
    //const verificationToken = uuidv4();

    // Generate verification token and expiration time
    //const verificationToken = new ObjectId().toString();
    const tokenExpirationTime = new Date();
    tokenExpirationTime.setHours(tokenExpirationTime.getHours() + 24); // Token expiration time of 24 hours

    // Create the user in the database
    const result = await db.collection("user").insertOne({
      email,
      nom,
      prenom,
      password: hashedPassword,
      verified: false,
      // verificationToken: verificationToken,
      verificationToken: "",
      verificationTokenExpirationTime: tokenExpirationTime,
    });

    // Send confirmation email
    //  const verificationToken = result.insertedId.toString();
    // await sendVerificationEmail(email, verificationToken);

    // Return success response .status(201)
    return res.status(200).json({ message: "User added successfully" });
    //  .json({ message: "Votre nouveau compte a été créé avec succés" });
  } catch (error) {
    console.error("Erreur de creation de compte:", error);
    return res.status(500).json({ message: "Echec de creation de compte" });
  } finally {
    // client.close();
  }
}
