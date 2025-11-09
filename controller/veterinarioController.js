import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarToken from "../helpers/generarToken.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {

    const { nombre, email } = req.body;

    try {
        //Usuario Existe
        const existeVeterinario = await Veterinario.findOne({ email: email });

        if (existeVeterinario) {
            const error = new Error('El veterinario ya esta Registrado')
            return res.status(409).json({ msg: error.message });
        }

        //Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body);
        await veterinario.save();

        
        //Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinario.token
        });
        
        const veterinarioGuardado = await Veterinario.findById(veterinario._id).select("nombre email _id");

        return res.status(201).json({
            msg: "Veterinaro Creado, Revisar Correo Electronico"
        }
        )

    } catch (e) {
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

};

const confirmarCuenta = async (req, res) => {

    const { token } = req.params;
    
    try {
        const existeToken = await Veterinario.findOne({ token: token });
    
        if (!existeToken) {
            const error = new Error('El Token no existe');
            return res.status(404).json({ msg: error.message });
        }

        existeToken.token = null;
        existeToken.confirmado = true;

        await existeToken.save();

        return res.status(200).json({ 
            msg: 'Cuenta Confirmada Correctamente' 
        });

    } catch (e) {
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

const autenticar = async (req, res) => {

    const { email, password } = req.body;

    try {
        //Comprobar que usuario exista
        const usuario = await Veterinario.findOne({ email: email });
    
        if (!usuario) {
            const error = new Error('La cuenta no existe')
            return res.status(404).json({ 
                msg: error.message 
            });
        }
    
        //Comprobar que la cuenta este confirmada
        if (!usuario.confirmado) {
            const error = new Error('La cuenta no ha sido confirmada')
            return res.status(403).json({ 
                msg: error.message 
            });
        }
    
        //Revisar el password
        const passwordCorrecto = await usuario.comprobarPassword(password);
    
        if (!passwordCorrecto) {
            const error = new Error('La Contraeña no es Correcta');
            return res.status(403).json({ 
                msg: error.message 
            });
        }
    
        //Autenticar
        return res.json({
            data: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                telefono: usuario.telefono,
                web: usuario.web,
                token: generarJWT({
                    id: usuario.id,
                    nombre: usuario.nombre
                })
            },
            msg: "Veterinario Logueado Correctamente"
        })
        
    } catch (e) {
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }


}

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    
    try {
        //Existe usuario
        const existeVeterinario = await Veterinario.findOne({ email: email });
    
        if (!existeVeterinario) {
            const error = new Error('El usuario no Existe')
            return res.status(400).json({ msg: error.message });
        }

        existeVeterinario.token = generarToken();
        await existeVeterinario.save();

        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        return res.json({ msg: "Hemos enviado un email con las instrucciones" })

    } catch (e) {
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }


}

const comprobarToken = async (req, res) => {

    const { token } = req.params;

    const existeToken = await Veterinario.findOne({ token: token });

    if (!existeToken) {
        const error = new Error('Token no válido')
        return res.status(400).json({ msg: error.message });
    }

    res.json({ msg: "Token válido, el Usuario existe" });


}

const nuevoPassword = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token: token });

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;

        await veterinario.save();

        res.json({ msg: "Pasword Guardado correctamente" });
    } catch (e) {
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const perfil = (req, res) => {

    const { veterinario } = req;

    return res.json({ 
        data: {
            veterinario
        }
    })
}

const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    
    try {

        const veterinario = await Veterinario.findById(id);
    
        if (!veterinario) {
            const error = new Error('El veterinario no existe')
            return res.status(400).json({ msg: error.message })
        }
    
        if (veterinario.email !== req.body.email) {
            const existeEmail = await Veterinario.findOne({ email: req.body.email });
            if (existeEmail) {
                const error = new Error('El email ya esta en uso')
                return res.status(400).json({ msg: error.message })
            }
        }

        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        const veterinarioFiltrado = await Veterinario.findById(veterinarioActualizado._id).select("nombre email telefono web _id");

        return res.json({
            data: {
                veterinario: veterinarioFiltrado
            },
            msg: "Veterinario Actualizado Correctamente"
        });

    } catch (e) {
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const actualizarPassword = async (req, res) => {

    console.log(req.body);
    const { passwordActual, nuevoPassword } = req.body;
    const { id } = req.veterinario;
    try {
        const veterinario = await Veterinario.findById(id);
    
        //Comprobar que veterinario existe
        if (!veterinario) {
            const error = new Error('El veterinario no existe')
            return res.status(404).json({ msg: error.message })
        }
    
        //Comprobar su password
        const passwordCorrecto = await veterinario.comprobarPassword(passwordActual);
    
        if (!passwordCorrecto) {
            const error = new Error('El password actual no es Correcto');
            return res.status(400).json({ msg: error.message });
        }
    
        //Almacenar el nuevo password
        veterinario.password = nuevoPassword;
        await veterinario.save();

        return res.json({ 
            msg: "Password Almacenado Correctamente" 
        });

    } catch (e) {
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

export {
    registrar,
    confirmarCuenta,
    perfil,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    autenticar,
    actualizarPerfil,
    actualizarPassword
}