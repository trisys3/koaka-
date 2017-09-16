import isCommand from './is-command';

describe('a command', () => {
  test('is a string', () => {
    const command = null;
    expect(isCommand(command)).not.toBeTruthy();
  });

  test('can not be a URL', () => {
    const command = 'http://google.com';
    expect(isCommand(command)).not.toBeTruthy();
  });

  test('is a non-URL command', () => {
    const command = 'cat my-file.js';
    expect(isCommand(command)).toBeTruthy();
  });
});
