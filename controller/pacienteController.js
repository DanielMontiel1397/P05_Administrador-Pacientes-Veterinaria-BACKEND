import Paciente from '../models/Paciente.js';
import mongoose from 'mongoose';

const agregarPaciente = async (req,res) => {
    
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;

    try{
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado)
    } catch(error){
        console.log(error);
    }

}

const optenerPacientes = async (req,res) => {
    
    //Obtener pacientes del veterinario que inicio sesion

    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes)

}

const obtenerPaciente = async (req,res) => {

    const {id} = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: 'No Encontrado'})
    } 

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.jason({msg: "Accion no válida"})
    }

    res.json(paciente);

}

const actualizarPaciente = async (req,res) => {

    const {id} = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: 'No Encontrado'})
    } 

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.jason({msg: "Accion no válida"})
    }

    //Actualizar Paciente
    const {nombre,propietario,email,fecha,sintomas} = req.body;

    paciente.nombre = nombre || paciente.nombre;
    paciente.propietario = propietario || paciente.propietario;
    paciente.email = email || paciente.email;
    paciente.fecha = fecha || paciente.fecha;
    paciente.sintomas = sintomas || paciente.sintomas;

    try{
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch(error){
        console.log(error);
    }

}

const eliminarPaciente = async (req,res) => {
    
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(403).json({ msg: error.message });
    }

    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: 'No Encontrado'})
    } 

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.jason({msg: "Accion no válida"})
    }

    try{
        await paciente.deleteOne();
        res.json({msg: 'Paciente eliminado'});
    } catch(error){
        console.log(error);
    }
}


export{
    optenerPacientes,
    agregarPaciente,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}