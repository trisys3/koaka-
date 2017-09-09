import Koa from 'koa';

import vhost, {filterHost as filter} from '.';

describe('when filtering virtual hosts', () => {
  test('a non-string hostname should always match', () =>
    expect(filter()).toBeTruthy());

  test('when no virtual hosts are expected it should always match', () => {
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
  const next = () => new Promise(() => {
    // empty resolver
  });
  let ctx = {};

  beforeEach(() => {
    ctx = {};
  });

  test('should defer to other middleware when no domain is passed', () => {
    const vhostMw = vhost();
    const afterVhost = vhostMw(ctx, next);
    expect(afterVhost).toBeInstanceOf(Promise);
  });

  test('should defer to other middleware when the domain matches', () => {
    ctx.hostname = 'actual.domain.my';

    const vhostMw = vhost('actual.domain.my');
    const afterVhost = vhostMw(ctx, next);
    expect(afterVhost).toBeInstanceOf(Promise);
  });

  test('should not defer to other middleware when the domain does not match', () => {
    ctx.hostname = 'nonexistent.domain.my';

    const vhostMw = vhost('actual.domain.my');
    const afterVhost = vhostMw(ctx, next);
    expect(afterVhost).not.toBeInstanceOf(Promise);
  });
});
