import { connectToDatabase } from "../util/mongodb";

export async function getSelectedimg(imgid) {
  const { db } = await connectToDatabase();
  const mySelectedimg = await db
    .collection("imgmrventes")
    // .find({ imgNum: parseInt(imgid) }, { projection: { _id: 0 } })
    .find({ imgNum: parseInt(imgid) })
    // .find({ imgNum: 1 })
    .limit(1)
    .toArray();

  return mySelectedimg;
}
