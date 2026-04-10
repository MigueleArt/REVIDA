import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  donacion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  solicitante_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  estado_solicitud: { 
    type: String, 
    enum: ['Pendiente', 'Aprobada', 'Rechazada'],
    default: 'Pendiente'
  },
  fecha_solicitud: { type: Date, default: Date.now }
});

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);