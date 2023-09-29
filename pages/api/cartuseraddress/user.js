import { connectToDatabase } from "../../../util/mongodb";

export async function getUser() {
  const { db } = await connectToDatabase();
  const myUser = await db
    .collection("user")
    // .find({}, { projection: { _id: 0 } })
    //.find({})
    .find()
    // .limit(21)
    .toArray();
  return myUser;
}

export default async (req, res) => {
  const myUser = await getUser();
  res.json(myUser);
};
