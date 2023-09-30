//import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../../util/mongodb";

export default async function handler(req, res) {
  // const session = await getSession({ req });
  //const session = await getSession({ req });

  /*if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }*/

  if (req.method === "GET" || req.method === "POST") {
    const { email } = req.query;

    if (!email) {
      // res.status(200).json({ message: "Missing email" });
      res.status(400).json({ message: "Missing email" });
      return;
    }

    //console.log("email :");
    //console.log(email);

    const { db } = await connectToDatabase();

    // Construct a query object
    const query = { email: email };

    // Check if the user already exists
    //const existingUser = await db.collection("user").findOne({ email });
    const existingUser = await db.collection("user").findOne(query);

    if (!existingUser) {
      //res.status(200).json({ message: "User not found" });
      res.status(404).json({ message: "User not found" });
      return;
    }

    // res.status(200).json(existingUser);
    res.status(200).json({ message: "User found" });
    // res.status(200).json({ existingUser });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
