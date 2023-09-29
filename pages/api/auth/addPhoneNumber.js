import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // const { email } = req.body;
    // const { email, telPortable } = req.query;
    const { email, telPortable } = req.body;

    // console.log("Lundi on server Add phone number:", email);

    try {
      // Store the reset code in the database (MongoDB)
      const { db } = await connectToDatabase();
      // const user = db.collection("user");

      // Check if the user already exists
      const user = await db.collection("user").findOne({ email: email });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      await db
        .collection("user")
        .updateOne({ email: email }, { $set: { telPortable: telPortable } });

      console.log("Le téléphone portable a été ajouté avec succés");

      return res.status(200).json({ message: "Tel added successfully" });
    } catch (error) {
      console.error("Error adding tel :", error);
      return res.status(500).json({ error: "Failed to add Tel" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
