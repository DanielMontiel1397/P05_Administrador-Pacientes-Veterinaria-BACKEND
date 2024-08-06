import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarToken from "../helpers/generarToken.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req,res) => {

    const {nombre, email, password} = req.body;

    //Usuario Existe
    const existeVeterinario  = await Veterinario.findOne({email: email});

    if(existeVeterinario){
        const error = new Error('El veterinario ya esta Registrado')
        return res.status(400).json({msg: error.message});
    }

    try{
        //Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();
        
        //Enviar el email
        emailRegistro({
            email,
            nombre, 
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado)
    } catch(error){
        console.log(`El error es: ${error}`);
    }

};

const confirmarCuenta = async (req,res) => {
    
    const {token} =req.params;
    console.log(`El token es: ${token}`);
    const existeToken = await Veterinario.findOne({token:token});

    if(!existeToken){
        const error = new Error('El Token no existe');
        return res.status(400).json({msg: error.message});
    }
    console.log('El token si existe');
    try{
        existeToken.token = null;
        existeToken.confirmado = true;
        await existeToken.save();

        res.json({msg: 'Cuenta Confirmada Correctamente'});

    } catch(error){
        console.log(`El error es: ${error}`);
    }
}

const autenticar = async (req,res) => {
    
    const {email, password} = req.body;

    //Comprobar que usuario exista
    const usuario = await Veterinario.findOne({email: email});

    if(!usuario){
        const error = new Error('La cuenta no existe')
        return res.status(401).json({msg: error.message});
    }

    //Comprobar que la cuenta este confirmada
    if(!usuario.confirmado){
        const error = new Error('La cuenta no ha sido confirmada')
        return res.status(403).json({msg: error.message});
    }

    //Revisar el password
    const passwordCorrecto = await usuario.comprobarPassword(password);

    if(!passwordCorrecto){
        const error = new Error('La Contraeña no es Correcta');
        return res.status(403).json({msg: error.message});
    }

    //Autenticar
    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id)
    })

}

const olvidePassword = async (req,res) => {
    const {email} = req.body;

    //Existe usuario
    const existeVeterinario = await Veterinario.findOne({email: email});

    if(!existeVeterinario){
        const error = new Error('El usuario no Existe')
        return res.status(400).json({msg: error.message});
    }

    try{
        existeVeterinario.token = generarToken();
        await existeVeterinario.save();

        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg: "Hemos enviado un email con las instrucciones"})
    } catch(error){
        console.log(error);
    }


}

const comprobarToken = async (req,res) => {

    const {token} = req.params;
    
    const existeToken = await Veterinario.findOne({token: token});

    if(!existeToken){
        const error = new Error('Token no válido')
        return res.status(400).json({msg: error.message});
    }

    res.json({msg: "Token válido, el Usuario existe"});


}

const nuevoPassword = async (req,res) => {

    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token: token});

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try{
        veterinario.token = null;
        veterinario.password = password;

        await veterinario.save();

        res.json({msg: "Pasword Guardado correctamente"});
    } catch(error){
        console.log(error);
    }

}

const perfil = (req,res) => {
    
    const {veterinario} = req;

    res.json({veterinario})
}

const actualizarPerfil = async (req,res) => {
    const {id} = req.params;

    const veterinario = await Veterinario.findById(id);

    if(!veterinario){
        const error = new Error('El veterinario no existe')
        return res.status(400).json({msg: error.message})
    }

    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email: req.body.email});
        if(existeEmail){
            const error = new Error('El email ya esta en uso')
            return res.status(400).json({msg: error.message})
        }
    }

    try{
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email ;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono ;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch(error){
        console.log(error);
    }

}

const actualizarPassword = async (req,res) => {

    const {passwordActual, nuevoPassword} = req.body;
    const {id} = req.veterinario;

    const veterinario = await Veterinario.findById(id);

    //Comprobar que veterinario existe
    if(!veterinario){
        const error = new Error('El veterinario no existe')
        return res.status(400).json({msg: error.message})
    }

    //Comprobar su password
    const passwordCorrecto = await veterinario.comprobarPassword(passwordActual);

    if(!passwordCorrecto){
        const error = new Error('El password actual no es Correcto');
        return res.status(400).json({msg: error.message});
    }
    
    //Almacenar el nuevo password
    try{
        veterinario.password = nuevoPassword;
        await veterinario.save();
        res.json({msg: "Password Almacenado Correctamente"});
    } catch(error){
        console.log(error);
    }
}

export{
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