import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import User, { User as UserInterface } from '../../users/schema';

export default fp(async function authenticatePlugin (fastify: FastifyInstance) {
  fastify.decorate('authenticate', async (request: FastifyRequest) => {
    if (!request.cookies.token) {
      throw fastify.httpErrors.unauthorized('Invalid access token');
    }

    let payload;
    try {
      payload = await fastify.jwt.verify(request.cookies.token);
    } catch (err) {
      throw fastify.httpErrors.unauthorized('Invalid access token');
    }

    const user = await fastify.mongoose.model<UserInterface>('User', User).findOne({ email: payload.email });

    if (!user) {
      throw fastify.httpErrors.unauthorized('Invalid access token');
    }

    request.user = user;
  });
});