import 'dotenv/config';
import mongoose from 'mongoose';
import Appointment from '../src/appointments/appointment.model.js';

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI no esta definido en el entorno');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Conectado a MongoDB');

  const result = await Appointment.syncIndexes();
  console.log('Indices de appointments sincronizados:', result);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error('Error sincronizando indices de citas:', error);
  process.exit(1);
});
