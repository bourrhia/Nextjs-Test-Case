import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await handleUserAdrLivReq(req, res);
      break;
    //case 'DELETE':
    //  await handleDeleteRequest(req, res);
    //  break;
    default: //405 means error with request
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleUserAdrLivReq(req, res) {
  try {
    // connect to the database
    const { db } = await connectToDatabase();

    const {
      userId,
      nom,
      prenom,
      adressePrinc1,
      adressePrinc2,
      ville,
      region,
      codePostal,
      tel,
    } = req.body;

    /*console.log("userId : ", userId);
    console.log("nom: ", nom);
    console.log(" prenom: ", prenom);
    console.log("adressePrinc1: ", adressePrinc1);
    console.log("adressePrinc2: ", adressePrinc2);
    console.log("ville: ", ville);
    console.log("region: ", region);
    console.log("codepostal: ", codePostal);
    console.log("tel: ", tel);*/

    await db.collection("user").updateOne(
      { userId: parseInt(userId) },
      {
        $set: {
          
          nom: nom,
          prenom: prenom,
          adressePrinc1: adressePrinc1,
          adressePrinc2: adressePrinc2,
          ville: ville,
          region: region,
          codePostal: codePostal,
          tel: tel,
        },
      },
      { upsert: true }
    );

    // return a message
    return res.json({
      message: "Votre adrsesse de livraison a été ajouté avec succés",
      // success: true,
    });
  } catch (error) {
    // return an error
    return res.json({
      message: new Error(error).message,
      //  success: false,
    });
  }
}
