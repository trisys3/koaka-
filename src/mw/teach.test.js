import teach from './teach';

const noop = () => {
  // empty function
};

let ctx = {};
describe('teaching', () => {
  beforeEach(() => {
    ctx = {app: {}, status: 404};
  });

  test('no lessons is possible', () => {
    const teacher = teach();
    teacher(ctx, noop);
    expect(ctx.app.lessons).toHaveLength(0);
  });

  describe('a single lesson', () => {
    const lesson = {steps: 'echo \'Hello World\''};

    test('is possible', () => {
      const teacher = teach({lessons: lesson});
      teacher(ctx, noop);
      expect(ctx.app.lessons).toHaveLength(1);
    });

    test('with a name keeps the name', () => {
      const lessonName = 'My Lesson';
      const teacher = teach({name: lessonName, lessons: lesson});

      teacher(ctx, noop);

      expect(ctx.app.lessons[0]).toHaveProperty('name', lessonName);
    });

    test('without a name is possible', () => {
      const teacher = teach({lessons: lesson});
      teacher(ctx, noop);
      expect(ctx.app.lessons).toHaveLength(1);
    });
  });

  test('multiple lessons is possible', () => {
    const lessons = [{steps: 'echo \'Hello World\''}, {steps: 'google.com'}];
    const teacher = teach({lessons});
    teacher(ctx, noop);
    expect(ctx.app.lessons).toHaveLength(2);
  });

  test('multiple times teaches the lesson multiple times', () => {
    const step = 'echo \'Hello world!\'';

    const teacher1 = teach({lessons: {steps: step}});
    const teacher2 = teach({lessons: {steps: step}});

    teacher1(ctx, noop);
    teacher2(ctx, noop);

    expect(ctx.app.lessons).toHaveLength(2);
  });

  describe('with a single request', () => {
    beforeEach(() => {
      ctx = {app: {}, status: 404};
    });

    test('multiple times only teaches the original request once', () => {
      const step = 'google.com';
      const teacher = teach({lessons: {steps: step}});

      teacher(ctx, noop);
      teacher(ctx, noop);

      expect(ctx.app.lessons).toHaveLength(1);
    });

    test('adds a slash at the beginning of the specified route for convenience', () => {
      const route = 'some/path';
      const teacher = teach({route});

      ctx.path = '/some/path';

      teacher(ctx, noop);
      expect(ctx.status).toBe(200);
    });

    describe('by GETting', () => {
      beforeEach(() => {
        ctx = {app: {}, status: 404};
      });

      test('shows the lessons already learned', () => {
        const step = 'google.com';
        const teacher = teach({lessons: {steps: step}});

        teacher(ctx, noop);

        expect(ctx.app.lessons).toHaveLength(1);
      });

      test('by default, teaches with the /assess route', () => {
        const teacher = teach();

        ctx.path = '/nonexistent/path';
        teacher(ctx, noop);
        expect(ctx.status).toBe(404);

        ctx.path = '/assess';
        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });

      test('teaches with the route specified', () => {
        const route = '/some/path';
        const teacher = teach({route});

        teacher(ctx, noop);
        expect(ctx.status).toBe(404);

        ctx.path = '/some/path';
        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });
    });

    describe('by POSTing', () => {
      beforeEach(() => {
        ctx = {app: {}, status: 404, method: 'POST'};
      });

      test('adds a slash at the beginning of the specified route for convenience', () => {
        const route = 'some/path';
        const teacher = teach({post: route});

        ctx.path = '/some/path';

        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });
      test('with no lessons teaches nothing', () => {
        const teacher = teach();
        ctx.path = '/teach';
        teacher(ctx, noop);
        expect(ctx.app.lessons).toHaveLength(0);
      });

      test('with a single lesson in the request body is possible', () => {
        const step = 'google.com';
        const teacher = teach();

        ctx.path = '/teach';
        ctx.body = {lessons: {steps: step}};

        teacher(ctx, noop);
        expect(ctx.app.lessons).toHaveLength(1);
      });

      test('with multiple lessons in the request body is possible', () => {
        const step = 'google.com';
        const teacher = teach();

        ctx.path = '/teach';
        ctx.body = {lessons: [{steps: step}, {steps: step}]};

        teacher(ctx, noop);
        expect(ctx.app.lessons).toHaveLength(2);
      });

      test('by default, teaches with the /teach route', () => {
        const teacher = teach();

        ctx.path = '/nonexistent/path';

        teacher(ctx, noop);
        expect(ctx.status).toBe(404);

        ctx.path = '/teach';
        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });

      test('teaches with the route specified', () => {
        const route = '/some/path';
        const teacher = teach({post: route});

        teacher(ctx, noop);
        expect(ctx.status).toBe(404);

        ctx.path = '/some/path';
        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });
    });

    describe('by DELETEing', () => {
      beforeEach(() => {
        ctx = {app: {}, status: 404, method: 'DELETE'};
      });

      test('adds a slash at the beginning of the specified route for convenience', () => {
        const route = 'some/path';
        const teacher = teach({delete: route});

        ctx.path = '/some/path';

        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });

      test('by default, unteaches with the /unteach route', () => {
        const teacher = teach();

        teacher(ctx, noop);
        expect(ctx.status).toBe(404);

        ctx.path = '/unteach';
        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });

      test('unteaches with the route specified', () => {
        const route = '/some/path';
        const teacher = teach({delete: route});

        teacher(ctx, noop);
        expect(ctx.status).toBe(404);

        ctx.path = '/some/path';
        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });

      test('can unteach no lessons', () => {
        const lessons = [{name: 'Lesson 1'}, {name: 'Lesson 2'}];
        const teacher = teach({lessons});

        ctx.path = '/unteach';
        ctx.body = {lessons: 'Lesson 3'};

        teacher(ctx, noop);
        expect(ctx.app.lessons).toHaveLength(2);
      });

      test('can unteach a single lesson from the middleware options', () => {
        const lessons = [{name: 'Lesson 1'}, {name: 'Lesson 2'}];
        const teacher = teach({lessons});

        ctx.path = '/unteach';
        ctx.body = {lessons: 'Lesson 1'};

        teacher(ctx, noop);
        expect(ctx.app.lessons).toHaveLength(1);
      });

      test('can unteach a single lesson from previous requests', () => {
        const lessons = [{name: 'Lesson 1'}, {name: 'Lesson 2'}];
        const teacher = teach();

        ctx.path = '/teach';
        ctx.body = {lessons};
        ctx.method = 'POST';
        teacher(ctx, noop);

        ctx.path = '/unteach';
        ctx.body = {lessons: 'Lesson 1'};
        ctx.method = 'DELETE';
        teacher(ctx, noop);
        expect(ctx.app.lessons).toHaveLength(1);
      });

      test('can unteach multiple lessons from the middleware options', () => {
        const lessons = [{name: 'Lesson 1'}, {name: 'Lesson 2'}, {name: 'Lesson 3'}];
        const teacher = teach({lessons});

        ctx.path = '/unteach';
        ctx.body = {lessons: ['Lesson 1', 'Lesson 2']};

        teacher(ctx, noop);
        expect(ctx.app.lessons).toHaveLength(1);
      });

      test('can unteach multiple lessons from previous requests', () => {
        const lessons = [{name: 'Lesson 1'}, {name: 'Lesson 2'}, {name: 'Lesson 3'}];
        const teacher = teach();

        ctx.path = '/teach';
        ctx.body = {lessons};
        ctx.method = 'POST';
        teacher(ctx, noop);

        ctx.path = '/unteach';
        ctx.body = {lessons: ['Lesson 1', 'Lesson 2']};
        ctx.method = 'DELETE';
        teacher(ctx, noop);
        expect(ctx.app.lessons).toHaveLength(1);
      });
    });
  });
});
