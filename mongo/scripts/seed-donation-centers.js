import 'dotenv/config';
import mongoose from 'mongoose';
import DonationCenter from '../src/donation-centers/donation-center.model.js';

const CENTERS = [
  {
    name: 'Hospital San José',
    address: '3a Av. 12-51, Zona 10',
    zone: 'Zona 10',
    latitude: 14.5994,
    longitude: -90.5075,
    urgentRequests: [{ bloodType: 'O+', unitsRequired: 3 }],
  },
  {
    name: 'Clínica del Norte',
    address: '6a Calle 7-30, Zona 1',
    zone: 'Zona 1',
    latitude: 14.6407,
    longitude: -90.5133,
    urgentRequests: [{ bloodType: 'A-', unitsRequired: 2 }],
  },
  {
    name: 'Hospital Central',
    address: '10a Av. 9-52, Zona 1',
    zone: 'Zona 1',
    latitude: 14.6349,
    longitude: -90.5155,
    urgentRequests: [{ bloodType: 'B+', unitsRequired: 4 }],
  },
  {
    name: 'Hospital Roosevelt',
    address: 'Calzada Roosevelt 5-59, Zona 11',
    zone: 'Zona 11',
    latitude: 14.6141,
    longitude: -90.5559,
    urgentRequests: [{ bloodType: 'B+', unitsRequired: 4 }],
  },
  {
    name: 'Hospital General San Juan de Dios',
    address: '1a Av. 10-50, Zona 1',
    zone: 'Zona 1',
    latitude: 14.6274,
    longitude: -90.5202,
    urgentRequests: [{ bloodType: 'O-', unitsRequired: 2 }],
  },
  {
    name: 'Centro Médico Militar',
    address: 'Av. Reforma 4-00, Zona 10',
    zone: 'Zona 10',
    latitude: 14.5967,
    longitude: -90.5089,
    urgentRequests: [],
  },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI no esta definido en el entorno');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Conectado a MongoDB');

  for (const center of CENTERS) {
    await DonationCenter.findOneAndUpdate(
      { name: center.name },
      { $set: center },
      { upsert: true, new: true }
    );
    console.log(`Sembrado: ${center.name}`);
  }

  console.log('Listo. Centros de donacion sembrados.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error('Error sembrando centros de donacion:', error);
  process.exit(1);
});
