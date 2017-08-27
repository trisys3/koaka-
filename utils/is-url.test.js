import isUrl from './is-url';

describe('a url', () => {
  test('must be a string', () => {
    const url = null;
    expect(isUrl(url)).not.toBeTruthy();
  });

  test('can have a query string', () => {
    const url = 'http://google.com?q=search_terms';
    expect(isUrl(url)).toBeTruthy();
  });

  test('can have an empty query string', () => {
    const url = 'http://google.com?';
    expect(isUrl(url)).toBeTruthy();
  });

  describe('can have the protocol', () => {
    test('HTTP', () => {
      const url = 'http://my.server';
      expect(isUrl(url)).toBeTruthy();
    });

    test('HTTPS', () => {
      const url = 'https://secure.my.server';
      expect(isUrl(url)).toBeTruthy();
    });

    test('FTP', () => {
      const url = 'ftp://my.file.server';
      expect(isUrl(url)).toBeTruthy();
    });

    test('FTPS', () => {
      const url = 'ftps://secure.my.file.server';
      expect(isUrl(url)).toBeTruthy();
    });
  });

  test('can\'t have an unknown protocol', () => {
    const url = 'unknown://my.server';
    expect(isUrl(url)).not.toBeTruthy();
  });

  test('can have no protocol', () => {
    const url = 'my.server';
    expect(isUrl(url)).toBeTruthy();
  });

  test('needs at least 1 dot', () => {
    const url = 'server';
    expect(isUrl(url)).not.toBeTruthy();
  });
});
