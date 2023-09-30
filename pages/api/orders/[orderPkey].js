import { connectToDatabase } from "../../../util/mongodb";

// const { ObjectID } = require("mongodb");
//var ObjectId = require("mongodb").ObjectId;

const { ObjectId } = require("mongodb");

export async function getOrderById(orderPkey) {
  const { db } = await connectToDatabase();

  // Construct a query object with the _id field
  const query = { _id: new ObjectId(orderPkey) };

  // const myOrder = await db.collection("orders").findOne(query, { _id: 0 });
  const myOrder = await db.collection("orders").findOne(query);

  return myOrder;
}

export default async (req, res) => {
  try {
    const { orderPkey } = req.query;
    const myOrder = await getOrderById(orderPkey);
    res.json(myOrder);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};
