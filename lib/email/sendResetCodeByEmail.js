import sgMail from "@sendgrid/mail";

export async function sendResetCodeByEmail(email, resetCode) {
  //const confirmationLink = `${process.env.BASE_URL}/auth/verify-email/${verificationToken}`;
  /*  const confirmationLink = `${
    process.env.BASE_URL
  }/auth/verify-email/${verificationToken}?email=${encodeURIComponent(email)}`;*/

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Verifier votre identité",

    html: `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verifier votre identité (Nouveau mot de passe)</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <div style="background-color: #f8f8f8; padding: 20px;">
      <table
        style="
          background-color: #ffffff;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          border-collapse: collapse;
        "
      >
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #0070ba;">Dimapromo</h2>
            <h3 style="margin-top: 20px;">Confirmer cette adresse e-mail</h3>
            <p style="margin-top: 20px;">
              Bonjour,
              <br />
              <br />
              Pour vérifier votre identité, veuillez utiliser le code suivant : 
            </p>
            
            
            <p style="margin-top: 5px;
            font-weight : bold;
            font-seize : 16px;">${resetCode}</p>
            
            </p>
           
           
            <br />
            <br />
            Ne partagez ce code avec personne. 
              <br />
              <br />
              Merci.
            </p>
          </td>
        </tr>
      </table>
    </div>
   
  </body>
</html>
`,
  };

  try {
    await sgMail.send(msg);
    //sgMail.send(msg);
    console.log("Confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
}
