import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

    //Enviar Email
    const {email,nombre,token} = datos;

    const info = await transport.sendMail({
        from: "APV - Administrador de pacientes de Veterinaria",
        to: email,
        subject: "Reestablece tú password.",
        text: "Reestablece tú password.",
        html: `
            <p>Hola: ${nombre}, has solicitado reestablecer tú password.</p>
            <p>Sigue el siguiente enlace para generar un nuevo Password: 
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
            </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });

    console.log("Mensaje Enviado: %s", info.messageId);

}

export default emailOlvidePassword;