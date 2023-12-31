import { connectToDatabase } from "../../util/mongodb";
const { ObjectId } = require("mongodb");

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    // Insert an empty document into the users collection
    const result = await db.collection("user").insertOne({});
    const insertedId = result.insertedId; // Get the inserted _id
    return res.status(200).json({ userId: insertedId });

    // Construct a query object with the _id field
    /*const query = { _id: new ObjectId(insertedId) };

    // Query the document from the database using the inserted _id
    const insertedDocument = await db.collection("user").findOne(query);
    //.findOne({ _id: insertedId });

    // Retrieve the auto-incremented userId from the inserted document
    //const userId = insertedDocument.userId; // Access the userId field

    if (insertedDocument && insertedDocument.userId) {
      const userId = insertedDocument.userId;
      return res.status(200).json({ userId: userId });
    } else {
      return res.status(404).json({ message: "User Not Found" });
    }*/

    // Return the userId in the response
    //return res.status(200).json(userId);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
  }
};
