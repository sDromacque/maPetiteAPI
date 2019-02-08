import mongoose from 'mongoose';
import dotenv from 'dotenv-safe';

import { env } from '../config/vars';

dotenv.config();

const { MONGO_URI, MONGO_DATABASE, MONGO_PORT } = process.env;

mongoose.Promise = global.Promise;

const startDB = async () => {
  // print mongoose logs in dev env
  if (env === 'development') {
    mongoose.set('debug', true);
  }

  try {
    await mongoose.connect(`mongodb://${MONGO_URI}:${MONGO_PORT}/${MONGO_DATABASE}`, { useMongoClient: true, keepAlive: 1 });
    console.info('Connected to mongo!!!');
  } catch (error) {
    console.error('Could not connect to MongoDB');
    process.exit(-1);
  }
};

module.exports = startDB;
