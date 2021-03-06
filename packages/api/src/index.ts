import Fastify from 'fastify';
import fastifyEnv from 'fastify-env';
import fastifyCookie from 'fastify-cookie';
import fastifyJwt from 'fastify-jwt';
import fastifySensible from 'fastify-sensible';
import fastifyFormbody from '@fastify/formbody';

import mailer from './modules/common/plugins/mailer';
import mongoose from './modules/common/plugins/mongoose';
import authenticate from './modules/common/plugins/authenticate';

import users from './modules/users/controllers';
import products from './modules/products/controllers';
import carts from './modules/carts/controllers';
import orders from './modules/orders/controllers';

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
      PASSWORD_SALT_ROUNDS: {
        type: 'number',
        default: 10,
      },
      MAIL_PASSWORD: {
        type: 'string',
      },
      BASE_URL: {
        type: 'string',
        default: 'https://darlingdove.ru',
      },
      YANDEX_WALLET: {
        type: 'string',
      },
      YANDEX_PAYMENT_NOTIFICATION_SECRET: {
        type: 'string',
      }
    }
  },
});
fastify.register(fastifySensible);
fastify.register(fastifyFormbody);
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
fastify.register(mailer, (f) => ({
  defaults: { from: 'DarlingDove <info@darlingdove.ru>' },
  transport: {
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'info@darlingdove.ru',
      pass: f.config.MAIL_PASSWORD,
    }
  }
}));

// routes
fastify.register(users);
fastify.register(products);
fastify.register(carts);
fastify.register(orders);

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
