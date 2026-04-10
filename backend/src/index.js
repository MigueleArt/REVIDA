import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from '../lib/mongodb.js'; 
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Conexión a la base de datos
dbConnect();

// --- CONFIGURACIÓN DE CORS ULTRA-PERMISIVA ---
app.use(cors({
  origin: true, // Permite cualquier origen
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas de prueba rápida
app.get('/', (req, res) => {
  res.status(200).send("Servidor REVIDA Online 🚀");
});

// Rutas de la API
app.use('/api/usuarios', userRoutes);

// Manejador de errores para depurar si algo falla internamente
app.use((err, req, res, next) => {
  console.error("Error interno:", err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});