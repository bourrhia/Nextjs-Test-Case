import { connectToDatabase } from "../../util/mongodb";

export async function getOneimg() {
  const { db } = await connectToDatabase();
  const myLgimgmrv = await db
    .collection("imgmrventes")
    // .find({}, { projection: { _id: 0 } })
    .find()
    .limit(1)
    .toArray();
  return myLgimgmrv;
}

export default async (req, res) => {
  const myLgimgmrv = await getOneimg();
  res.json(myLgimgmrv);
};
