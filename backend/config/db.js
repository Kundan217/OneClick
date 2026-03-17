import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

const connectDB = async () => {
  const envUri = process.env.MONGO_URI;

  try {
    if (envUri) {
      await mongoose.connect(envUri);
      console.log('MongoDB connected successfully');
      return;
    }

    const uri = await startInMemoryMongo();
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);

    // If we were trying to connect to a real Mongo instance, fall back to in-memory.
    if (envUri) {
      console.warn('Falling back to in-memory MongoDB');
      const uri = await startInMemoryMongo();
      await mongoose.connect(uri);
      console.log('Connected to in-memory MongoDB');
      return;
    }

    process.exit(1);
  }
};

const startInMemoryMongo = async () => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
    console.log('Started in-memory MongoDB');

    // Clean up on exit
    const cleanup = async () => {
      if (mongod) {
        await mongod.stop();
      }
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', cleanup);
  }

  return mongod.getUri();
};

export default connectDB;
