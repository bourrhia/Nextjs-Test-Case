const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  const {
    email,
    message,
    // cartProdDesc,
    // cartProdQtee,
    // cartProdPrix,
    prenom,
    nom,
    adresseLiv1,
    adresseLiv2,
    villeLiv,
    regionLiv,
    codePostalLiv,
    telLiv,
    dateLiv,
    methodeLiv,
    nbrProdCmd,
    mtLiv,
    total,
    cart,
  } = req.body;

  //console.log("Mardi 7 mars Minuit 2 : ");
  //console.log(req.body);

  /*Handlebars.registerHelper("distanceFixed", function (prodPrix) {
    return prodPrix.toFixed(2);
  });*/

  const getReformatCart = function (cart) {
    return cart.map(function (cartItem) {
      let CartItemPrice = parseFloat(
        Math.round(cartItem.prodPrix * 100) / 100
      ).toFixed(2);
      // create a new object to store full name.
      const cartFormated = {};
      cartFormated["prodDesc"] = cartItem.prodDesc;
      cartFormated["prodQtee"] = cartItem.prodQtee;
      cartFormated["prodPrix"] = CartItemPrice;

      // return our new object.
      return cartFormated;
    });
  };

  const reformatCart = getReformatCart(cart);

  const msg = {
    to: email, // Change to your recipient
    // to: "elmosbourrhia@gmail.com", // Change to your recipient
    from: "elmosbourrhia@gmail.com", // Change to your verified sender
    subject: "Commande Dimapromo",
    /* html: `<p><strong>email: </strong>${email}</p>    
          <p><strong>message: </strong>${message}</p>`,*/
    templateId: "d-c772d528cba04e8b9d4132da3f4c495a",

    dynamic_template_data: {
      // email: email,
      // message: message,
      // cartProdDesc: cartProdDesc,
      // cartProdQtee: cartProdQtee,
      // cartProdPrix: cartProdPrix,
      subject: "Dimapromo - Commande",
      prenom: prenom,
      nom: nom,
      adrLiv1: adresseLiv1,
      adrLiv2: adresseLiv2,
      vilLiv: villeLiv,
      regLiv: regionLiv,
      codePLiv: codePostalLiv,
      telLiv: telLiv,
      dateLiv: dateLiv,
      methodeLiv: methodeLiv,
      nbrProdCmd: nbrProdCmd,
      total: total,
      cart: reformatCart,
      receipt: true,
      mtLiv: mtLiv,
    },
  };

  try {
    await sgMail.send(msg);
    res.json({ message: `Email has been sent` });
  } catch (error) {
    res.status(500).json({ error: "Error sending email" });
  }
};
