import sgMail from "@sendgrid/mail";

export async function sendVerificationEmail(email, verificationToken) {
  //const confirmationLink = `${process.env.BASE_URL}/auth/verify-email/${verificationToken}`;
  const confirmationLink = `${
    process.env.BASE_URL
  }/auth/verify-email/${verificationToken}?email=${encodeURIComponent(email)}`;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Confirmer votre adresse e-mail sous 24 heures",

    html: `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
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
              Vous avez presque terminé ! Vous devez confirmer cette adresse e-mail avant de pouvoir l'utiliser pour accéder à votre nouveau compte.
              <br />
              <br />
              Une fois votre adresse e-mail confirmée, vous ne pourrez plus utiliser votre compte existant.
              <br />
              <br />
              Si vous n'avez pas essayé de créer un compte à l'aide de cette adresse e-mail, contactez-nous.
            </p>
            <a
              href="${confirmationLink}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #0070ba;
                color: #fff;
                text-decoration: none;
                margin-top: 20px;
              "
            >
              Confirmer
            </a>
            
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
