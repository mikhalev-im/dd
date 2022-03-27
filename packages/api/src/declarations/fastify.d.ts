import { Mongoose } from 'mongoose';

declare module 'fastify' {
  interface FastifyInstance {
    mongoose: Mongoose;
    config: {
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET: string;
    },
  }
}