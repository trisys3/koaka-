import Koa from 'koa';

import teach from './mw/teach';
import vhost from './vhost';
import mw from './middleware';

const servers = {};
class Koaka {
  ports = [];

  constructor({steps, domain = 'localhost', ports} = {}) {
    if(!Array.isArray(ports)) {
      ports = [ports];
    }

    const server = new Koa();

    server.use(vhost(domain))
      .use(teach({lessons: steps}))
      .use(mw);

    Object.assign(this, {teach, server, steps});

    this.serve(ports);
  }

  serve(ports) {
    if(!Array.isArray(ports)) {
      ports = [ports];
    }

    return ports
      .filter(port => typeof port === 'number' &&
        !this.ports.find(servedPort => port === servedPort))
      .map(port => {
        this.ports.push(port);
        return servers[port] = this.server.listen(port);
      });
  }

  kill(ports) {
    if(!Array.isArray(ports)) {
      ports = [ports];
    }

    return ports
      .filter(port => typeof port === 'number' &&
        this.ports.find(killPort => port === killPort))
      .map((port, portIndex) => {
        const server = servers[port];
        server.close();
        this.ports.splice(portIndex, 1);
        return server;
      });
  }
}

export default Koaka;
