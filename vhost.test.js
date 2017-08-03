import koa from 'koa';

import vhost, {filterHost as filter} from './vhost';

describe('when filtering virtual hosts', () => {
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
    const filterHosts = ['string.server.my', 'string.server.yours'];

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
