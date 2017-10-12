import quizzer from './quiz';
import Koa from 'koa';

const quiz = quizzer();

const noop = () => {
  // empty function for testing purposes
};
const ctx = {};

describe('Testing', () => {
  describe('a lesson', () => {
    beforeEach(() => {
      Object.assign(ctx, {app: {}, body: {}, status: 404});
    });

    test('which does not exist fails', () => {
      const stepName = 'My Nonexistent Lesson';
      ctx.path = `/${stepName}`;

      quiz(ctx, noop);
      expect(ctx.status).toBe(404);
    });

    test('which exists but has no steps fails', () => {
      const stepName = 'My Existing Lesson';
      ctx.path = `/${stepName}`;

      ctx.app = {lessons: {[stepName]: []}};
      quiz(ctx, noop);
      expect(ctx.status).toBe(404);
    });
  });

  describe('a command', () => {
    const command = 'echo -n Hello world!';
    const output = 'Hello world!';
    const failCommand = 'cat nonexistent-file';

    beforeEach(() => {
      Object.assign(ctx, {app: {lessons: {}}, status: 404});
    });

    test('calls the command', async () => {
      const stepName = 'My Command Test';
      ctx.path = `/${stepName}`;

      ctx.app.lessons[stepName] = command;
      await quiz(ctx, noop);
      expect(ctx.body.lessons).toContain(output);

      ctx.app.lessons[stepName] = {step: command};
      await quiz(ctx, noop);
      return expect(ctx.body.lessons).toContain(output);
    });

    test('can use a different shell', async () => {
      const stepName = 'My Command Test With Different Shell';
      ctx.path = `/${stepName}`;

      ctx.app.lessons[stepName] = {shell: 'bash', step: command};
      await quiz(ctx, noop);
      return expect(ctx.body.lessons).toContain(output);
    });

    test('can succeed', async () => {
      const stepName = 'My Succeeding Command Test';
      ctx.path = `/${stepName}`;

      ctx.app.lessons[stepName] = command;
      await quiz(ctx, noop);
      expect(ctx.status).toBe(200);

      ctx.app.lessons[stepName] = {step: command};
      await quiz(ctx, noop);
      return expect(ctx.status).toBe(200);
    });

    test('can fail', async () => {
      const stepName = 'My Failing Command Test';
      ctx.path = `/${stepName}`;

      ctx.app.lessons[stepName] = failCommand;
      await quiz(ctx, noop);
      expect(ctx.status).toBe(404);

      ctx.app.lessons[stepName] = {step: failCommand};
      await quiz(ctx, noop);
      return expect(ctx.status).toBe(404);
    });
  });

  describe('a URL', () => {
    const url = 'github.com/trisys3/koaka-thing';
    const fullUrl = 'https://github.com/koaka-thing';
    const failUrl = 'https://github.com/nonexistent-path';

    beforeEach(() => {
      Object.assign(ctx, {app: {lessons: {}}, status: 404});
    });

    // revisit this when we have a URL where we can be sure of the response
    test.skip('requests the URL', async () => {
      const stepName = 'My Request Test';
      ctx.path = `/${stepName}`;

      ctx.app.lessons[stepName] = fullUrl;
      await quiz(ctx, noop);
      expect(ctx.body.lessons).toContain(fullUrl);

      ctx.app.lessons[stepName] = {step: fullUrl};
      await quiz(ctx, noop);
      return expect(ctx.body.lessons).toContain(fullUrl);
    });

    // revisit this when we have a URL where we can be sure of the response
    test.skip('requests the full URL', async () => {
      const stepName = 'My Full URL Test';
      ctx.path = `/${stepName}`;

      ctx.app.lessons[stepName] = url;
      await quiz(ctx, noop);
      expect(ctx.body.lessons).toContain(`http://${url}`);

      ctx.app.lessons[stepName] = {step: url};
      await quiz(ctx, noop);
      return expect(ctx.body.lessons).toContain(`http://${url}`);
    });

    test('can succeed', async () => {
      const stepName = 'My Succeeding Request Test';
      ctx.path = `/${stepName}`;

      ctx.app.lessons[stepName] = url;
      await quiz(ctx, noop);
      expect(ctx.status).toBe(200);

      ctx.app.lessons[stepName] = {step: url};
      await quiz(ctx, noop);
      return expect(ctx.status).toBe(200);
    });

    test('can fail', async () => {
      const stepName = 'My Failing Request Test';
      ctx.path = `/${stepName}`;

      ctx.app.lessons[stepName] = failUrl;
      await quiz(ctx, noop);
      expect(ctx.status).toBe(404);

      ctx.app.lessons[stepName] = {step: failUrl};
      await quiz(ctx, noop);
      return expect(ctx.status).toBe(404);
    });
  });

  describe('multiple commands &/or requests', () => {
    const successSteps = ['github.com/trisys3/koaka-thing', 'echo Hello world!'];
    const failSteps = ['github.com/trisys3/koaka-thing', 'cat nonexistent-file'];

    beforeEach(() => {
      Object.assign(ctx, {app: {lessons: {}}, status: 404});
    });

    test('succeeds if all steps succeed', async () => {
      const stepName = 'My Succeeding Test';
      ctx.app.lessons[stepName] = successSteps;
      ctx.path = `/${stepName}`;

      await quiz(ctx, noop);
      return expect(ctx.status).toBe(200);
    });

    test('fails if even 1 of the steps fails', async () => {
      const stepName = 'My Failing Test';
      ctx.app.lessons[stepName] = failSteps;
      ctx.path = `/${stepName}`;

      await quiz(ctx, noop);
      return expect(ctx.status).toBe(404);
    });
  });
});
