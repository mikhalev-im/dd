import fastify from 'fastify';

const server = fastify({
  logger: true,
});

server.get('/', async (request, reply) => {
  return reply.send({ hello: 'world' });
});

const main = async () => {
  try {
    const address = await server.listen(8080, '0.0.0.0');
    console.log(`Server listening at ${address}`);
  }
  catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

main();
