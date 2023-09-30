import { connectToDatabase } from "../../../util/mongodb";

export async function getUserAdrLiv(userId) {
  const { db } = await connectToDatabase();
  const myUserAdrLiv = await db
    .collection("user")
    .findOne({ userId: parseInt(userId) }, { _id: 0 });
  //.find({ userId: parseInt(userId) }, { projection: { _id: 0 } })
  // .toArray();
  return myUserAdrLiv;
}

export default async (req, res) => {
  try {
    const { userId } = req.query;
    const myUserAdrLiv = await getUserAdrLiv(userId);
    res.json(myUserAdrLiv);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};
