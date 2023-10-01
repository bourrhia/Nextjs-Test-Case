import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    // Insert an empty document into the users collection
    const result = await db.collection("user").insertOne({});

    const generatedUserId = result.insertedId;

    // Find the document by generated _id
    const user = await db.collection("user").findOne({ _id: generatedUserId });

    /*if (user) {
      const userId = user.userId;
      return res.status(200).json({ userId: userId });
    } else {
      return null; // User with the given _id not found
    }*/

    if (user && user.userId) {
      const userId = user.userId;
      return res.status(200).json({ userId: userId });
    } else {
      return res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
  }
};
