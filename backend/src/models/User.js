import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  rol: { 
    type: String, 
    enum: ['Administrador', 'Organizacion', 'Donador'], 
    required: true 
  },
  fecha_creacion: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);