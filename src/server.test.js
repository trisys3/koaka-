jest.mock('./mw/teach');
jest.mock('./vhost');
jest.mock('./middleware');

import Koaka from './server';

describe('A Koaka server', () => {
  test('can serve on 0 ports at a time', () => {
    const server = new Koaka();
    server.serve();
    expect(server.ports).toHaveLength(0);
  });
  
  test('can serve on 1 port at a time', () => {
    const port = 3000;
    const server = new Koaka();
    server.serve(port);
    expect(server.ports).toHaveLength(1);
  });
  
  test('can serve on multiple ports at a time', () => {
    const ports = [3000, 4000];
    const server = new Koaka();
    server.serve(ports);
    expect(server.ports).toHaveLength(2);
  });

  test('can not serve on ports that have already been served on', () => {
    const port = 3000;
    const server = new Koaka({ports: port});
    server.serve(port);
    expect(server.ports).toHaveLength(1);
  });
  
  test('can kill 0 servers at a time', () => {
    const ports = [3000, 4000, 5000];
    const server = new Koaka({ports});
    server.kill();
    expect(server.ports).toHaveLength(3);
  });
  
  test('can kill 1 server at a time', () => {
    const ports = [3000, 4000, 5000];
    const killPort = 3000;
    const server = new Koaka({ports});
    server.kill(killPort);
    expect(server.ports).toHaveLength(2);
  });
  
  test('can kill multiple servers at a time', () => {
    const ports = [3000, 4000, 5000];
    const killPorts = [3000, 4000];
    const server = new Koaka({ports});
    server.kill(killPorts);
    expect(server.ports).toHaveLength(1);
  });

  test('can not kill ports that are not being served on', () => {
    const port = 3000;
    const killPort = 4000;
    const server = new Koaka({ports: port});
    server.kill(killPort);
    expect(server.ports).toHaveLength(1);
  });
});
