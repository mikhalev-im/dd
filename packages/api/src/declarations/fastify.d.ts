import { Mongoose } from 'mongoose';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>,
    mongoose: Mongoose;
    config: {
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production';
    },
  }
}