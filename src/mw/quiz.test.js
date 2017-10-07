jest.mock('request-promise-native');

// use quiz because jest is hogging the global test variable
import quizzer from './quiz';
import * as nrc from 'node-run-cmd';
import request from 'request-promise-native';

const run = jest.spyOn(nrc, 'run');
const quiz = quizzer();

const noop = () => {
  // empty function for testing purposes
};
const ctx = {};

describe('Testing', () => {
  describe('a lesson', () => {
    beforeEach(() => {
      Object.assign(ctx, {app: {}, status: 404});
    });

    test('which does not exist fails', () => {
      ctx.path = '/My Nonexistent Lesson';

      quiz(ctx, noop);
      expect(ctx.status).toBe(404);
    });

    test('which exists but has no steps fails', () => {
      ctx.app.lessons = {'My Existing Lesson': []};
      ctx.path = 'My Existing Lesson';

      quiz(ctx, noop);
      expect(ctx.status).toBe(404);
    });
  });

  describe('a command', () => {
    const command = 'echo Hello world!';
    const failCommand = 'cat nonexistent-file';

    beforeEach(() => {
      Object.assign(ctx, {app: {lessons: {}}, status: 404});
      run.mockClear();
    });

    test('calls the command', () => {
      ctx.app.lessons['My Command Test'] = command;
      ctx.path = '/My Command Test';

      quiz(ctx, noop);
      expect(run).toHaveBeenCalledWith(command);
    });

    test('can succeed', () => {
      ctx.app.lessons['My Succeeding Command Test'] = command;
      ctx.path = '/My Succeeding Command Test';

      quiz(ctx, noop);
      expect(ctx.status).toBe(200);
    });

    test('can fail', () => {
      ctx.app.lessons['My Failing Command Test'] = failCommand;
      ctx.path = '/My Failing Command Test';

      quiz(ctx, noop);
      expect(ctx.status).toBe(404);
    });
  });

  describe('a URL', () => {
    const url = 'google.com';
    const failUrl = 'koaka.io/nonexistent-path';

    beforeEach(() => {
      Object.assign(ctx, {app: {lessons: {}}, status: 404});
      request.mockClear();
    });

    test('requests the URL', () => {
      ctx.app.lessons['My Request Test'] = url;
      ctx.path = '/My Request Test';

      quiz(ctx, noop);
      expect(request).toHaveBeenCalledWith(url);
    });

    test('can succeed', () => {
      ctx.app.lessons['My Succeeding Request Test'] = url;
      ctx.path = '/My Succeeding Request Test';

      quiz(ctx, noop);
      expect(ctx.status).toBe(200);
    });

    test('can fail', () => {
      ctx.app.lessons['My Failing Request Test'] = failUrl;
      ctx.path = '/My Failing Request Test';

      quiz(ctx, noop);
      expect(ctx.status).toBe(404);
    });
  });

  describe('multiple commands &/or requests', () => {
    const successSteps = ['google.com', 'echo "Hello world!"'];
    const failSteps = ['google.com', 'cat nonexistent-file'];

    beforeEach(() => {
      Object.assign(ctx, {app: {lessons: {}}, status: 404});
    });

    test('succeeds if all steps succeed', () => {
      ctx.app.lessons['My Succeeding Test'] = successSteps;
      ctx.path = '/My Succeeding Test';

      quiz(ctx, noop);
      expect(ctx.status).toBe(200);
    });

    test('fails if even 1 of the steps fails', () => {
      ctx.app.lessons['My Failing Test'] = failSteps;
      ctx.request.body = {lesson: 'My Failing Test'};

      quiz(ctx, noop);
      expect(ctx.status).toBe(404);
    });
  });
});
