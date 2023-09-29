/*import { lgimgmrventes } from "../../data/mrventes";

export default (req, res) => {
  res.status(200).json(lgimgmrventes);
};*/

import { connectToDatabase } from "../../util/mongodb";

export async function getLgimgmrv() {
  const { db } = await connectToDatabase();
  const myLgimgmrv = await db
    .collection("imgmrventes")
    // .find({}, { projection: { _id: 0 } })
    //.find({})
    .find()
    .limit(21)
    .toArray();
  return myLgimgmrv;
}

export default async (req, res) => {
  const myLgimgmrv = await getLgimgmrv();
  res.json(myLgimgmrv);
};
