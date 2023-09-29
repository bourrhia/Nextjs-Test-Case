import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await handleUserAdrFactReq(req, res);
      break;
    //case 'DELETE':
    //  await handleDeleteRequest(req, res);
    //  break;
    default: //405 means error with request
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleUserAdrFactReq(req, res) {
  try {
    // connect to the database
    const { db } = await connectToDatabase();

    const {
      userId,
      adrPrinc1Fact,
      adrPrinc2Fact,
      villeFact,
      codePostalFact,
      regionFact,
      telFact,
    } = req.body;

    await db.collection("user").updateOne(
      { userId: parseInt(userId) },
      {
        $set: {
          adrPrinc1Fact: adrPrinc1Fact,
          adrPrinc2Fact: adrPrinc2Fact,
          villeFact: villeFact,
          codePostalFact: codePostalFact,
          regionFact: regionFact,
          telFact: telFact,
        },
      },
      { upsert: true }
    );

    // return a message
    return res.json({
      message: "Votre adrsesse de facturation a été ajouté avec succés",
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
