import { connectToDatabase } from "../../util/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId
//const { ObjectId } = require("mongodb");

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!id) {
    return res.status(400).json({ message: "Missing _id parameter" });
  }

  const { db } = await connectToDatabase();

  try {
    const objectId = new ObjectId(id); // Convert _id string to ObjectId
    const user = await db.collection("user").findOne({ _id: objectId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching User:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
