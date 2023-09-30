import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    /*const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }*/

    const { email, resetCode } = req.body;

    if (!email || !resetCode) {
      return res
        .status(400)
        .json({ message: "Email and resetCode are required." });
    }

    const { db } = await connectToDatabase(); // Connect to your MongoDB.

    console.log("verify reset code on Server : ");
    console.log("resetCode on Server : ", resetCode);
    console.log("Email on server : ", email);

    // Check if the resetCode is valid for the given email.
    const user = await db.collection("user").findOne({ email, resetCode });

    if (user) {
      return res.status(200).json({ message: "Reset code is valid" });
    } else {
      return res.status(400).json({ message: "Invalid reset code or email" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}
