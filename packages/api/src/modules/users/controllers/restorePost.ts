import { FastifyInstance } from 'fastify';
import { User } from '../schema';

interface Body {
  email: string;
}

interface Context {
  Body: Body
};

export default (fastify: FastifyInstance) => {
  fastify.post<Context>('/users/restore', {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email'
          },
        },
      },
      response: {
        204: {},
      },
    },
    handler: async (request) => {
      const User = fastify.mongoose.model<User>('User');

      const user = await User.findOne({ email: request.body.email });
      if (!user) {
        throw fastify.httpErrors.notFound('User does not exist');
      }

      const token = fastify.jwt.sign({ email: user.email }, { expiresIn: '3 days' });

      await fastify.mailer.sendMail({
        to: user.email,
        subject: 'Восстановление пароля',
        html: `
          <p>
            <strong>
              Восстановление доступа к <a href="${fastify.config.BASE_URL}">darlingdove.ru</a>
            </strong>
          </p>
          <p>
            Для восстановления доступа к сайту пройдите по <a href="${fastify.config.BASE_URL}/api/users/restore?token=${token}">этой ссылке</a>
          </p>
        `
      });

      return {};
    }
  });
}
