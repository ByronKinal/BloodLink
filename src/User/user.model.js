import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    match: [/\S+@\S+\.\S+/, 'Por favor ingresa un email válido'] 
  },
  password: {
    type: String,
    required: true,
    minlength: 6 
  },
  role: {
    type: String,
    enum: ['ADMIN', 'STAFF', 'DONOR'],
    default: 'DONOR'
  },
  bloodType: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    required: function () { return this.role === 'DONOR'; } 
  },
  staffPosition: {
    type: String,
    required: function () { return this.role === 'STAFF'; }
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

export { User };