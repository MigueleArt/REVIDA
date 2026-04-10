import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String }, // Opcional si prefieres guardar el JWT aquí
  fecha_expiracion: { type: Date, required: true }
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);