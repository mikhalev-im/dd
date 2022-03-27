import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';

import User, { User as UserInterface } from '../../users/schema';

export default fp(async function mongoosePlugin (fastify: FastifyInstance) {
  mongoose.model<UserInterface>('User', User);

  await mongoose.connect(fastify.config.MONGO_URI);

  mongoose.connection.on('error', err => {
    fastify.log.error({ err }, 'mongoose connection error occured');
  });

  fastify.decorate('mongoose', mongoose);
});