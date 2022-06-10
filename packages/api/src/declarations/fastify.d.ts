import { FastifyPluginAsync } from 'fastify'
import { Mongoose } from 'mongoose';
import { Transporter } from 'nodemailer';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>,
    mongoose: Mongoose;
    config: {
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production';
      PASSWORD_SALT_ROUNDS: number;
      MAIL_PASSWORD: string;
      BASE_URL: string;
    },
    mailer: Transporter;
  }
}