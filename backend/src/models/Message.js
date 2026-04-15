import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversacion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  remitente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  texto: { type: String, required: true },
  fecha_envio: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false }
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);