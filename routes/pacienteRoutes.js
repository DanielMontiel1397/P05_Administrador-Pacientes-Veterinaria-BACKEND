import { optenerPacientes,agregarPaciente, obtenerPaciente, actualizarPaciente, eliminarPaciente } from '../controller/pacienteController.js';
import protegerRuta from '../middelware/protegerRuta.js';
import express from 'express';

const routes = express.Router();

routes.get('/',protegerRuta,optenerPacientes);
routes.post('/',protegerRuta, agregarPaciente);

routes.get('/:id',protegerRuta,obtenerPaciente);
routes.put('/:id',protegerRuta,actualizarPaciente);
routes.delete('/:id',protegerRuta,eliminarPaciente);



export default routes;