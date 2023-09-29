import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    const products = await db.collection("product").find({}).toArray();

    res.status(200).json(products);
  } catch (error) {
    console.error("Erreur de liste de produits:", error);
    return res.status(405).json({ message: "Erreur de liste de produits" });
    // return  res.status(405).end();
  }
}
