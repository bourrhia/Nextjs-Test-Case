import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  const { query } = req.query;
  // const { searchTerm } = req.body;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  // console.log("searchTerm :", searchTerm);
  try {
    if (!query) {
      // throw new Error("Query parameter is required");
      return res.status(404).json({ error: "Query parameter is required." });
    }

    const { db } = await connectToDatabase();

    const results = await db
      .collection("product")
      .find({
        productName: { $regex: new RegExp(query, "i") }, // Perform case-insensitive search
      })
      .toArray();

    // console.log("results :", results);

    //return res.status(200).json(results);
    res.status(200).json(results);
    // return res.status(200).json({ message: "Successfull search" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
