import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    // Insert an empty document into the users collection
    const result = await db.collection("user").insertOne({});

    // Retrieve the generated user_id (auto-generated _id)
    // const generatedUserId = result.insertedId;
    // Ensure that the user_id field is returned in the inserted document
    // const generatedUserId = result.ops[0].userId;

    const generatedUserId = result.insertedId;

    // Find the document by generated _id
    const user = await db.collection("user").findOne({ _id: generatedUserId });

    if (user) {
      const userId = user.userId;
      //return userId;
      res.status(200).json({ userId: userId });
    } else {
      return null; // User with the given _id not found
    }

    // Query for the last inserted user_id (assuming it's the highest)
    /* const latestUser = await db
      .collection("user")
      .find({}, { sort: { userId: -1 }, limit: 1 })
      .toArray();

    if (latestUser.length === 1) {
      const generatedUserId = latestUser[0].userId;

      console.log("generatedUserId :", generatedUserId);

      // Send the generated user_id as a JSON response
      res.status(200).json({ userId: generatedUserId });
    }*/

    // Send the generated user_id as a JSON response
    //res.status(200).json({ userId: generatedUserId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
  }
};
