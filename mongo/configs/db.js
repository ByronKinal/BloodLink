import mongoose from 'mongoose';

let mongoReady = false;

export const connectMongoDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('MongoDB | MONGODB_URI no definido, el servicio iniciara sin conexion persistente');
    mongoReady = false;
    return;
  }

  try {
    console.log('MongoDB | Trying to connect...');
    await mongoose.connect(process.env.MONGODB_URI);
    mongoReady = true;
    console.log('MongoDB | Connected to MongoDB');
  } catch (error) {
    mongoReady = false;
    console.error('MongoDB | Could not connect to MongoDB');
    console.error('MongoDB | Error:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

export const isMongoConnected = () => mongoReady && mongoose.connection.readyState === 1;

const gracefulShutdown = async (signal) => {
  console.log(`MongoDB | Received ${signal}. Closing database connection...`);

  try {
    await mongoose.connection.close();
    console.log('MongoDB | Database connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB | Error during graceful shutdown:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

export default mongoose;