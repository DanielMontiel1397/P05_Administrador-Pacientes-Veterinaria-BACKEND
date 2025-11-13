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
        from: '"AdministradorPacientesVeterinaria.com" <no-reply@administradorpacientesveterinaria.com>',
        to: email,
        subject: "Confirma tú cuenta en APV",
        text: "Comprueba tú cuenta en APV",
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                
                <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">AdministradorPacientesVeterinaria.com</h1>
                </div>

                <div style="padding: 30px; color: #333;">
                <p style="font-size: 18px;">Hola <strong>${nombre}</strong>,</p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Gracias por registrarte en <strong>AdministradorPacientesVeterinaria.com</strong>.  
                    Tu cuenta ya está casi lista, solo necesitas confirmarla dando click en el siguiente botón:
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}"
                    style="background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Confirmar Cuenta
                    </a>
                </div>

                <p style="font-size: 15px; line-height: 1.6; color: #555;">
                    Si tú no creaste esta cuenta, puedes ignorar este mensaje sin problema.
                </p>
            
                </div>
            </div>
            </div>
        `
    });

    console.log("Mensaje Enviado: %s", info.messageId);

}

export default emailRegistro;