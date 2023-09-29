import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await handlePostRequest(req, res);
      break;
    //case 'DELETE':
    //  await handleDeleteRequest(req, res);
    //  break;
    default: //405 means error with request
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handlePostRequest(req, res) {
  try {
    // connect to the database
    const { db } = await connectToDatabase();

    // const { deliveryAddress } = req.body;
    const { userid, nomComplet, tel, adresseLigneUn, codePostal, ville } =
      req.body;

    /* const deliveryAddress = {
      // content: req.body.content,
      // creatorId: req.user._id,
      // createdAt: new Date(),

      userid: req.userid,
      nomComplet: req.nomComplet,
      tel: req.tel,
      adresseLigneUn: req.adresseLigneUn,
      codePostal: req.codePostal,
      ville: req.ville,
    };*/

    //console.log("nomComplet");
    // console.log(nomComplet);
    // if(!deliveryAddress || !deliveryAddress) return
    //  if (!deliveryAddress) return;
    // Insert a document into the collection
    await db.collection("userAddress").insertOne({
      userid,
      nomComplet,
      tel,
      adresseLigneUn,
      codePostal,
      ville,
    });
    // return a message
    return res.json({
      message: "User added successfully",
      success: true,
    });
  } catch (error) {
    // return an error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}
