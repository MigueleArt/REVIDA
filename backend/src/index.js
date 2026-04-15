import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from '../lib/mongodb.js'; 
import userRoutes from './routes/userRoutes.js';
import { registerTestOnlyRoutes } from './testing/testRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

export const activeSessions = new Map();

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

app.use('/api/usuarios', userRoutes);

if (process.env.NODE_ENV === 'test') {
  registerTestOnlyRoutes(app, activeSessions);
}

// Manejador de errores para depurar si algo falla internamente
app.use((err, req, res, next) => {
  console.error("Error interno:", err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

export default app;