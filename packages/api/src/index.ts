import Fastify from 'fastify';
import fastifyEnv from 'fastify-env';
import fastifyCookie from 'fastify-cookie';
import fastifyJwt from 'fastify-jwt';
import fastifySensible from 'fastify-sensible';

import mongoose from './modules/common/plugins/mongoose';
import authenticate from './modules/common/plugins/authenticate';

import users from './modules/users/controllers';

const fastify = Fastify({
  logger: true,
});

// plugins
fastify.register(fastifyEnv, {
  dotenv: true,
  schema: {
    type: 'object',
    required: ['PORT', 'MONGO_URI'],
    properties: {
      NODE_ENV: {
        type: 'string',
        default: 'development',
      },
      PORT: {
        type: 'string',
        default: '8080',
      },
      MONGO_URI: {
        type: 'string',
        default: 'mongodb://localhost:27017/dd',
      },
      JWT_SECRET: {
        type: 'string',
        default: 'YOUR_256_BIT_SECRET',
      },
    }
  },
});
fastify.register(fastifySensible);
fastify.register(fastifyCookie);
fastify.register(fastifyJwt, (f) => ({
  secret: f.config.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false
  }
}));
fastify.register(mongoose);
fastify.register(authenticate);

// routes
fastify.register(users);

const main = async () => {
  try {
    await fastify.ready();
    await fastify.listen(fastify.config.PORT, '0.0.0.0');
  }
  catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

main();
