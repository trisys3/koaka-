import teach from './teach';

const noop = () => {
  // empty function
};

let ctx = {};
describe('teaching', () => {
  beforeEach(() => {
    ctx = {state: {}, status: 404};
  });

  test('no lessons is possible', () => {
    const teacher = teach();
    teacher(ctx, noop);
    expect(ctx.state.lessons).toHaveLength(0);
  });

  describe('a single lesson', () => {
    const lesson = {steps: 'echo \'Hello World\''};

    test('is possible', () => {
      const teacher = teach({lessons: lesson});
      teacher(ctx, noop);
      expect(ctx.state.lessons).toHaveLength(1);
    });

    test('with a name keeps the name', () => {
      const lessonName = 'My Lesson';
      const teacher = teach({name: lessonName, lessons: lesson});

      teacher(ctx, noop);

      expect(ctx.state.lessons[0]).toHaveProperty('name', lessonName);
    });

    test('without a name is possible', () => {
      const teacher = teach({lessons: lesson});
      teacher(ctx, noop);
      expect(ctx.state.lessons).toHaveLength(1);
    });
  });

  test('multiple lessons is possible', () => {
    const lessons = [{steps: 'echo \'Hello World\''}, {steps: 'google.com'}];
    const teacher = teach({lessons});
    teacher(ctx, noop);
    expect(ctx.state.lessons).toHaveLength(2);
  });

  test('multiple times teaches the lesson multiple times', () => {
    const step = 'echo \'Hello world!\'';

    const teacher1 = teach({lessons: {steps: step}});
    const teacher2 = teach({lessons: {steps: step}});

    teacher1(ctx, noop);
    teacher2(ctx, noop);

    expect(ctx.state.lessons).toHaveLength(2);
  });

  describe('with a single request', () => {
    beforeEach(() => {
      ctx = {state: {}, status: 404};
    });

    test('multiple times only teaches the original request once', () => {
      const step = 'google.com';
      const teacher = teach({lessons: {steps: step}});

      teacher(ctx, noop);
      teacher(ctx, noop);

      expect(ctx.state.lessons).toHaveLength(1);
    });

    describe('by GETting', () => {
      beforeEach(() => {
        ctx = {state: {}, status: 404};
      });

      test('shows the lessons already learned', () => {
        const step = 'google.com';
        const teacher = teach({lessons: {steps: step}});

        teacher(ctx, noop);

        expect(ctx.state.lessons).toHaveLength(1);
      });
    });

    describe('by GETting or POSTing', () => {
      beforeEach(() => {
        ctx = {state: {}, status: 404};
      });

      test('adds a slash at the beginning of the specified route for convenience', () => {
        const route = 'some/path';
        const teacher = teach({route});

        ctx.path = '/some/path';

        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });

      test('by default, does not teach without the /teach route', () => {
        const teacher = teach();

        ctx.path = '/nonexistent/path';

        teacher(ctx, noop);
        expect(ctx.status).toBe(404);

        ctx.method = 'POST';
        ctx.status = 404;
        teacher(ctx, noop);
        expect(ctx.status).toBe(404);
      });

      test('does not teach without the route specified', () => {
        const route = '/some/path';
        const teacher = teach({route});

        ctx.path = '/nonexistent/path';

        teacher(ctx, noop);
        expect(ctx.status).toBe(404);

        ctx.method = 'POST';
        ctx.status = 404;
        teacher(ctx, noop);
        expect(ctx.status).toBe(404);
      });

      test('by default, teaches with the /teach route', () => {
        const teacher = teach();

        ctx.path = '/teach';

        teacher(ctx, noop);
        expect(ctx.status).toBe(200);

        ctx.method = 'POST';
        ctx.status = 404;
        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });

      test('teaches with the route specified', () => {
        const route = '/some/path';
        const teacher = teach({route});

        ctx.path = '/some/path';

        teacher(ctx, noop);
        expect(ctx.status).toBe(200);

        ctx.method = 'POST';
        ctx.status = 404;
        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });
    });

    describe('by POSTing', () => {
      beforeEach(() => {
        ctx = {state: {}, status: 404, method: 'POST'};
      });

      test('with no lessons teaches nothing', () => {
        const teacher = teach();
        ctx.path = '/teach';
        teacher(ctx, noop);
        expect(ctx.state.lessons).toHaveLength(0);
      });

      test('with a single lesson in the request body is possible', () => {
        const step = 'google.com';
        const teacher = teach();

        ctx.path = '/teach';
        ctx.body = {lessons: {steps: step}};

        teacher(ctx, noop);
        expect(ctx.state.lessons).toHaveLength(1);
      });

      test('with multiple lessons in the request body is possible', () => {
        const step = 'google.com';
        const teacher = teach();

        ctx.path = '/teach';
        ctx.body = {lessons: [{steps: step}, {steps: step}]};

        teacher(ctx, noop);
        expect(ctx.state.lessons).toHaveLength(2);
      });
    });

    describe('by DELETEing', () => {
      beforeEach(() => {
        ctx = {state: {}, status: 404, method: 'DELETE'};
      });

      test('adds a slash at the beginning of the specified route for convenience', () => {
        const route = 'some/path';
        const teacher = teach({delete: route});

        ctx.path = '/some/path';

        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });

      test('by default, does not unteach without the /unteach route', () => {
        const teacher = teach();

        ctx.path = '/nonexistent/path';

        teacher(ctx, noop);
        expect(ctx.status).toBe(404);
      });

      test('does not unteach without the route specified', () => {
        const route = '/some/path';
        const teacher = teach({delete: route});

        ctx.path = '/nonexistent/path';

        teacher(ctx, noop);
        expect(ctx.status).toBe(404);
      });

      test('by default, unteaches with the /unteach route', () => {
        const teacher = teach();

        ctx.path = '/unteach';

        teacher(ctx, noop);
        expect(ctx.status).toBe(200);
      });

      test('unteaches with the route specified', () => {
        const route = '/some/path';
        const teacher = teach({delete: route});

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
        expect(ctx.state.lessons).toHaveLength(2);
      });

      test('can unteach a single lesson from the middleware options', () => {
        const lessons = [{name: 'Lesson 1'}, {name: 'Lesson 2'}];
        const teacher = teach({lessons});

        ctx.path = '/unteach';
        ctx.body = {lessons: 'Lesson 1'};

        teacher(ctx, noop);
        expect(ctx.state.lessons).toHaveLength(1);
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
        expect(ctx.state.lessons).toHaveLength(1);
      });

      test('can unteach multiple lessons from the middleware options', () => {
        const lessons = [{name: 'Lesson 1'}, {name: 'Lesson 2'}, {name: 'Lesson 3'}];
        const teacher = teach({lessons});

        ctx.path = '/unteach';
        ctx.body = {lessons: ['Lesson 1', 'Lesson 2']};

        teacher(ctx, noop);
        expect(ctx.state.lessons).toHaveLength(1);
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
        expect(ctx.state.lessons).toHaveLength(1);
      });
    });
  });
});
