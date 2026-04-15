import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  donacion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  usuario_1_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  usuario_2_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha_actualizacion: { type: Date, default: Date.now }
});

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);