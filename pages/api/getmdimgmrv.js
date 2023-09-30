/*import { mdimgmrventes } from "../../data/mrventes";

export default (req, res) => {
  res.status(200).json(mdimgmrventes);
};*/

import { connectToDatabase } from "../../util/mongodb";

export async function getMdimgmrv() {
  const { db } = await connectToDatabase();
  const myMdimgmrv = await db
    .collection("imgmrventes")
    //.find({}, { projection: { _id: 0 } })
    .find()
    .limit(4)
    .toArray();
  return myMdimgmrv;
}

export default async (req, res) => {
  const myMdimgmrv = await getMdimgmrv();
  res.json(myMdimgmrv);
};
