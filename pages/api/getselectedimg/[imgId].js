import { connectToDatabase } from "../../../util/mongodb";
import { getSelectedimg } from "../../../lib/load_selected_img";

/*
export async function getSelectedimg(imgid) {
  const { db } = await connectToDatabase();
  const mySelectedimg = await db
    .collection("imgmrventes")
    .find({ imgNum: imgid }, { projection: { _id: 0 } })
    .limit(1)
    .toArray();
  return mySelectedimg;
}*/

export default async (req, res) => {
  const { imgId } = req.query;

  const mySelectedimg = await getSelectedimg(imgId);
  res.json(mySelectedimg);
};
