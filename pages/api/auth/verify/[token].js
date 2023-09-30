import { connectToDatabase } from "../../../../util/mongodb";
//import { ObjectId } from "mongodb";

export default async function confirmHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token } = req.query;

  try {
    // Connect to the MongoDB database
    const { db } = await connectToDatabase();

    //console.log("Vendredi token : ");
    //console.log(token);

    const user = await db
      .collection("user")
      .findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Votre vérification email est invalide" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Votre email est déjà vérifié" });
    }

    if (!user.verificationTokenExpirationTime) {
      return res.status(404).json({ message: "Aucune date expiration" });
    }

    // Check if the token has expired (e.g., using a time-limited token)
    const tokenExpirationTime = user.verificationTokenExpirationTime;
    const currentTime = new Date();

    if (currentTime > tokenExpirationTime) {
      // Handle expired token scenario (e.g., prompt the user to request a new verification email)
      return res
        .status(400)
        .json({ message: "La date de vérification email a expiré" });
    } else {
      // Update the user's status as verified
      await db
        .collection("user")
        .findOneAndUpdate(
          { verificationToken: token },
          { $set: { verified: true, verificationTokenExpirationTime: null } },
          { returnOriginal: false }
        );

      return res.status(200).json({ message: "Success verification" });
      //  .json({ message: "Votre email  a été verifié avec succés" });

      // Assuming verification is successful
      // return res.redirect("/signInForm");
      //res.redirect(verifEmailSuccess);
      // res.writeHead(307, { Location: verifEmailSuccess });
      // res.end();
    }
  } catch (error) {
    console.error("Erreur de verification email:", error);
    return res
      .status(500)
      .json({ message: "La vérification de votre email a échoué" });
  }
}
