import Koa from 'koa';

const behaviors = [];
const behavior = behaviors;

const server = Object.assign(new Koa(), {
  behavior,
  behaviors,
});

server.listen(3000);

export default server;

export {server, behavior, behaviors};
