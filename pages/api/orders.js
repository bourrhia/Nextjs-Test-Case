import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await handleOrdersReq(req, res);
      break;
    //case 'DELETE':
    //  await handleDeleteRequest(req, res);
    //  break;
    default: //405 means error with request
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleOrdersReq(req, res) {
  try {
    // connect to the database
    const { db } = await connectToDatabase();

    var Double = require("mongodb").Double;

    const {
      // order_id,
      userId,
      totalOrders,
      livOrders,
      // cartsId,
      // createdAt,
      cartOrder,
    } = req.body;

    let result = await db.collection("orders").insertOne({
      userId: userId,
      totalOrders: new Double(totalOrders),
      livOrders: new Double(livOrders),
      createdAt: new Date(),
      items: cartOrder,
    });

    const order_id = result.insertedId;

    /*  let result = await db.collection("orders").insertOne({
      userId: userId,
      totalOrders: new Double(totalOrders),
      livOrders: new Double(livOrders),
      createdAt: new Date(),
      items: [],
    });

    const insertCart = cartOrder.map((item) => {
      db.collection("orders").updateOne(
        { _id: result.insertedId },
        {
          $push: {
            items: {
              prodImage: item.prodImage,
              prodDesc: item.prodDesc,
              prodQtee: item.prodQtee,
              prodPrix: item.prodPrix,
            },
          },
        }
      );
    });

    insertCart();*/

    // return a message
    return res.json({
      message: "Votre commande a été ajouté avec succés",
      // success: true,
      data: {
        id: order_id,
      },
    });
  } catch (error) {
    // return an error
    return res.json({
      message: new Error(error).message,
      //  success: false,
    });
  }
}
