import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createTransport } from 'nodemailer';

interface Options {
  transport: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    }
  };
  defaults: {
    from: string;
  };
}

export default fp(async function mailerPlugin (fastify: FastifyInstance, options: Options) {
  const { defaults, transport } = options;
  const transporter = createTransport(transport, defaults);
  fastify.decorate('mailer', transporter);
});