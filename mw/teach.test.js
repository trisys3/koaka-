import teach from './teach';

const noop = () => {
  // empty function
};

describe('teaching', () => {
  let ctx = {};

  beforeEach(() => {
    ctx = {status: 404};
  });

  test('no lessons is possible', () => {
    const teacher = teach();
    teacher(ctx, noop);
    expect(ctx.lessons).toHaveLength(0);
  });

  describe('a single lesson', () => {
    const lesson = {steps: 'echo \'Hello World\''};

    test('is possible', () => {
      const teacher = teach({lessons: lesson});
      teacher(ctx, noop);
      expect(ctx.lessons).toHaveLength(1);
    });

    test('with a name keeps the name', () => {
      const lessonName = 'My Lesson';
      const teacher = teach(lessonName, {lessons: lesson});

      teacher(ctx, noop);

      expect(ctx.lessons[0]).toHaveProperty('name', lessonName);
    });

    test('without a name is possible', () => {
      const teacher = teach({lessons: lesson});
      teacher(ctx, noop);
      expect(ctx.lessons).toHaveLength(1);
    });
  });

  test('multiple lessons is possible', () => {
    const lessons = [{steps: 'echo \'Hello World\''}, {steps: 'google.com'}];
    const teacher = teach(lessons);
    teacher(ctx, noop);
    expect(ctx.lessons).toHaveLength(2);
  });

  test('multiple times teaches the lesson multiple times', () => {
    const step = 'echo \'Hello world!\'';

    const teacher1 = teach({steps: step});
    const teacher2 = teach({steps: step});

    teacher1(ctx, noop);
    teacher2(ctx, noop);

    expect(ctx.lessons).toHaveLength(2);
  });

  describe('with a single request', () => {
    test('multiple times only teaches the original request once', () => {
      const step = 'google.com';
      const teacher = teach({steps: step});

      teacher(ctx, noop);
      teacher(ctx, noop);

      expect(ctx.lessons).toHaveLength(1);
    });

    test('does not work without the /teach route', () => {
      const step = 'google.com';
      const teacher = teach();

      ctx.path = '/';
      ctx.query = {lessons: {steps: step}};
      ctx.body = {lessons: {steps: step}};

      teacher(ctx, noop);
      expect(ctx.lessons).toHaveLength(0);
    });

    test('works with the /teach route', () => {
      const step = 'google.com';
      const teacher = teach();

      ctx.path = '/teach';
      ctx.query = {lessons: {steps: step}};

      teacher(ctx, noop);
      expect(ctx.lessons).toHaveLength(1);
    });

    test('returns \'OK\' when teaching', () => {
      const step = 'google.com';
      const teacher = teach({steps: step});

      ctx.path = '/teach';
      ctx.query = {lessons: {steps: step}};

      teacher(ctx, noop);
      expect(ctx.status).toBe(200);
    });

    test('does not change from 404 when not teaching', () => {
      const teacher = teach();
      teacher(ctx, noop);
      expect(ctx.status).toBe(404);
    });

    test('returns \'OK\' when teaching from the middleware, as long as the path is correct', () => {
      const step = 'google.com';
      const teacher = teach({steps: step});
      ctx.path = '/teach';
      teacher(ctx, noop);
      expect(ctx.status).toBe(200);
    });

    test('does not change from 404 when teaching from the middleware if the path is not correct', () => {
      const step = 'google.com';
      const teacher = teach({steps: step});
      ctx.path = '/no-teach';
      teacher(ctx, noop);
      expect(ctx.status).toBe(404);
    });

    test('with no lessons teaches nothing', () => {
      const teacher = teach();
      ctx.path = '/teach';
      teacher(ctx, noop);
      expect(ctx.lessons).toHaveLength(0);
    });

    describe('with a single lesson', () => {
      test('in the query string is possible', () => {
        const step = 'google.com';
        const teacher = teach();

        ctx.path = '/teach';
        ctx.query = {lessons: {steps: step}};

        teacher(ctx, noop);
        expect(ctx.lessons).toHaveLength(1);
      });

      test('in the request body is possible', () => {
        const step = 'google.com';
        const teacher = teach();

        ctx.path = '/teach';
        ctx.body = {lessons: {steps: step}};

        teacher(ctx, noop);
        expect(ctx.lessons).toHaveLength(1);
      });
    });

    describe('with multiple lessons', () => {
      test('in the query string is possible', () => {
        const step = 'google.com';
        const teacher = teach();

        ctx.path = '/teach';
        ctx.query = {lessons: [{steps: step}, {steps: step}]};

        teacher(ctx, noop);
        expect(ctx.lessons).toHaveLength(2);
      });

      test('in the request body is possible', () => {
        const step = 'google.com';
        const teacher = teach();

        ctx.path = '/teach';
        ctx.body = {lessons: [{steps: step}, {steps: step}]};

        teacher(ctx, noop);
        expect(ctx.lessons).toHaveLength(2);
      });
    });
  });
});
