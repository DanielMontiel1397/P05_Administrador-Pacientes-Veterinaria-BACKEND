import nodemailer from 'nodemailer';

const emailRegistro = async (datos)=>{
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
        subject: "Confirma tú cuenta en APV",
        text: "Comprueba tú cuenta en APV",
        html: `
            <p>Hola: ${nombre}, comprueba tú cuenta en APV.</p>
            <p>Tú cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Confirmar Cuenta</a>
            </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });

    console.log("Mensaje Enviado: %s", info.messageId);

}

export default emailRegistro;