import Paciente from '../models/Paciente.js';
import mongoose from 'mongoose';

const agregarPaciente = async (req,res) => {
    
    const paciente = new Paciente(req.body);
    const {_id: idVeterinaroAuth} = req.veterinario;

    paciente.veterinario = idVeterinaroAuth;

    try{
        const pacienteAlmacenado = await paciente.save();
        return res.status(201).json({
            data: {
                paciente: pacienteAlmacenado
            }, 
            msg: 'Paciente Creado Correctamente'
        })
    } catch(e){
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const obtenerPacientes = async (req,res) => {

    try{
        //Obtener pacientes del veterinario que inicio sesion
        const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    
        return res.json({
            data: {
                pacientes: pacientes
            },
            msg: 'Pacientes Conseguidos Correctamente'
        })

    } catch(e) {
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const obtenerPaciente = async (req,res) => {

    const {id} = req.params;
    try {
        
        const paciente = await Paciente.findById(id);
    
        if(!paciente){
            return res.status(404).json({msg: 'No Encontrado'})
        } 
    
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
            return res.status(403).json({msg: "Accion no válida"})
        }
    
        return res.json({
            data: {
                paciente: paciente
            },
            msg: "Paciente Obtenido Correctamente"
        });

    } catch (e) {
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const actualizarPaciente = async (req,res) => {

    const {id} = req.params;

    try{

        const paciente = await Paciente.findById(id);
    
        if(!paciente){
            return res.status(404).json({msg: 'No Encontrado'})
        } 
    
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
            return res.status(403).json({msg: "Accion no válida"})
        }
    
        //Actualizar Paciente
        const {nombre,propietario,email,fecha,sintomas} = req.body;
    
        paciente.nombre = nombre || paciente.nombre;
        paciente.propietario = propietario || paciente.propietario;
        paciente.email = email || paciente.email;
        paciente.fecha = fecha || paciente.fecha;
        paciente.sintomas = sintomas || paciente.sintomas;

        const pacienteActualizado = await paciente.save();

        return res.json({
            data: {
                paciente: pacienteActualizado
            },
            msg: "Paciente Actualizado Correctamente"
        });

    } catch(e){
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }

}

const eliminarPaciente = async (req,res) => {
    
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(403).json({ msg: error.message });
    }

    
    try{
        const paciente = await Paciente.findById(id);
    
        if(!paciente){
            return res.status(404).json({msg: 'No Encontrado'})
        } 
    
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
            return res.json({msg: "Accion no válida"})
        }

        await paciente.deleteOne();

        return res.json({msg: 'Paciente Eliminado Correctamente'});

    } catch(e){
        console.log(e);
        const error = new Error('Hubo un error en el servidor');
        return res.status(500).json({
            msg: error.message
        })
    }
}

export{
    obtenerPacientes,
    agregarPaciente,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}