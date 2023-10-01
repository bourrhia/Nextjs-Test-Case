import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    // Insert an empty document into the users collection
    const result = await db.collection("user").insertOne({});
    const insertedId = result.insertedId; // Get the inserted _id

    // Query the document from the database using the inserted _id
    const insertedDocument = await db
      .collection("user")
      .findOne({ _id: insertedId });

    // Retrieve the auto-incremented userId from the inserted document
    const userId = insertedDocument.userId; // Access the userId field

    // Return the userId in the response
    return res.status(200).json(userId);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
  }
};
