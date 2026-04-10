import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  categoria: { 
    type: String, 
    enum: ['Ropa', 'Electrónicos', 'Muebles', 'Libros', 'Deportes', 'Otros'],
    required: true 
  },
  condicion: { 
    type: String, 
    enum: ['Nuevo', 'Como nuevo', 'Bueno', 'Aceptable'],
    required: true 
  },
  ubicacion: { type: String, required: true },
  imagen_url: { type: String },
  estado_donacion: { 
    type: String, 
    enum: ['Disponible', 'Reservada', 'Completada', 'Oculta'],
    default: 'Disponible'
  },
  fecha_publicacion: { type: Date, default: Date.now }
});

export default mongoose.models.Donation || mongoose.model('Donation', DonationSchema);