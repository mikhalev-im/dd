import { RouteOptions } from 'fastify';

const options: RouteOptions = {
  method: 'GET',
  url: '/users/me',
  schema: {
    response: {
      200: {}
    },
  },
  handler: async function(request, reply) {
    this.mongoose.model('User').find();
    return { hello: 'world' }
  }
};

export default options;
