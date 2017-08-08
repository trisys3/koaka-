import Koa from 'koa';

import vhost, {filterHost as filter} from './vhost';

describe('when filtering virtual hosts', () => {
  test('when a non-string hostname is passed', () =>
    expect(filter()).toBeTruthy());

  test('should match when no virtual hosts are expected', () => {
    const reqHost = 'anything.server.my';
    expect(filter(null, reqHost)).toBeTruthy();
  });

  describe('by string', () => {
    const filterHost = 'yes.server.my';

    test('host should match when the strings match', () => {
      const reqHost = 'yes.server.my';
      expect(filter(filterHost, reqHost)).toBeTruthy();
    });

    test('host should not match when the strings do not match', () => {
      const reqHost = 'no.server.my';
      expect(filter(filterHost, reqHost)).toBeFalsy();
    });
  });

  describe('by regex', () => {
    const filterHost = /.*.server.my/;

    test('host should match when the regex matches', () => {
      const reqHost = 'regex.server.my';
      expect(filter(filterHost, reqHost)).toBeTruthy();
    });

    test('host should not match when the regex does not match', () => {
      const reqHost = 'regex.server.yours';
      expect(filter(filterHost, reqHost)).toBeFalsy();
    });
  });

  describe('by array', () => {
    const filterHosts = [];

    test('should always match when array is empty', () => {
      expect(filter(filterHosts, null)).toBeTruthy();
    });

    describe('when array is not empty', () => {
    const filterHosts = ['string.server.my'];

      test('host should match when at least one vhost matches', () => {
        const reqHost = 'string.server.my';
        expect(filter(filterHosts, reqHost)).toBeTruthy();
      });

      test('host should not match when no vhost matches', () => {
        const reqHost = 'string.server.theirs';
        expect(filter(filterHosts, reqHost)).toBeFalsy();
      });
    });
  });
});

describe('virtual host middleware', () => {
  const request = require('request');

  const usedAfterMw = jest.fn();

  let koa;
  let server;

  beforeEach(() => {
    koa = new Koa();
    server = koa.listen(3000);
  });

  afterEach(() => {
    usedAfterMw.mockClear();
    server.close();
  });

  test('should defer to other middleware when no domain is passed', () => {
    expect.assertions(1);
    koa.use(vhost())
      .use(afterMw);

    const testReq = new Promise(resolve =>
      request('http://localhost:3000', () => resolve()));

    return testReq.then(() => expect(usedAfterMw.mock.calls.length).toBe(1));
  });

  test('should defer to other middleware when the domain matches', () => {
    expect.assertions(1);
    koa.use(vhost('localhost'))
      .use(afterMw);

    const testReq = new Promise(resolve =>
      request('http://localhost:3000', () => resolve()));

    return testReq.then(() => expect(usedAfterMw.mock.calls.length).toBe(1));
  });

  test('should not defer to other middleware when the domain does not match', () => {
    expect.assertions(1);
    koa.use(vhost('nonexistent.domain.my'))
      .use(afterMw);

    const testReq = new Promise(resolve =>
      request('http://localhost:3000', () => resolve()));

    return testReq.then(() => expect(usedAfterMw.mock.calls.length).toBe(0));
  });

  function afterMw() {
    usedAfterMw();
  }
});
