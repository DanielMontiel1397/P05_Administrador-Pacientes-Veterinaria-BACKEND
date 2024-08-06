import express from 'express';
import { perfil, registrar, confirmarCuenta, olvidePassword, comprobarToken, nuevoPassword, autenticar, actualizarPerfil, actualizarPassword } from '../controller/veterinarioController.js';
import protegerRuta from '../middelware/protegerRuta.js';

const router = express.Router();

router.post('/',registrar);
router.get('/confirmar/:token',confirmarCuenta)
router.post('/login',autenticar);
router.post('/olvide-password',olvidePassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

//Area Privada
router.get('/perfil',protegerRuta,perfil);
router.put('/perfil/:id',protegerRuta, actualizarPerfil)
router.put('/cambiar-password',protegerRuta, actualizarPassword)

export default router;