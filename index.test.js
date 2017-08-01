import {server, behavior, behaviors} from './index';

jest.mock('koa');

test('Server behaviors should be exposed by themselves.', () =>
  expect(behavior).toBe(server.behavior));
test('Behaviors should be exposed as singular or plural so users can use the one that works.', () =>
  expect(behavior).toBe(behaviors));
