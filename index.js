import express from 'express';
import conexionDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();

dotenv.config();

//Habilitar lectura de formulario
app.use(express.json());

//Conexión a Base de Datos
try{
    conexionDB();
} catch (error){
    console.log(error);
}

const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin,callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //El origen del Request esta permitido
            callback(null,true);
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(
    {origin: '*'}
));

///RUTAS
app.use('/api/veterinarios',veterinarioRoutes);

app.use('/api/pacientes',pacienteRoutes);

const port = process.env.PORT || 4000;

app.listen(port,()=>{
    console.log(`Servidor Funcionando en el puerto: ${port}`);
});

