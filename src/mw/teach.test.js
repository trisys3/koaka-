import teach from './teach';

const noop = () => {
  // empty function
};

describe('assessing', () => {
  let ctx = {};
  beforeEach(() => {
    ctx = {app: {}, status: 404};
  });

  test('adds a slash at the beginning of the specified route for convenience', () => {
    const route = 'some/path';
    const teacher = teach({route});

    ctx.path = '/some/path';

    teacher(ctx, noop);
    expect(ctx.status).toBe(200);
  });

  test('by default, uses the /assess route', () => {
    const teacher = teach();

    ctx.path = '/nonexistent/path';
    teacher(ctx, noop);
    expect(ctx.status).toBe(404);

    ctx.path = '/assess';
    teacher(ctx, noop);
    expect(ctx.status).toBe(200);
  });

  test('uses the route specified', () => {
    const route = '/some/path';
    const teacher = teach({route});

    teacher(ctx, noop);
    expect(ctx.status).toBe(404);

    ctx.path = '/some/path';
    teacher(ctx, noop);
    expect(ctx.status).toBe(200);
  });

  test('can list 0 taught lessons', () => {
    const teacher = teach();

    ctx.path = '/assess';

    teacher(ctx, noop);
    expect(ctx.body.lessons).toHaveLength(0);
  });

  test('can list 1 taught lesson', () => {
    const teacher = teach();

    ctx.app.lessons = {name: 'Lesson 1'};
    ctx.path = '/assess';

    teacher(ctx, noop);
    expect(ctx.body.lessons).toHaveLength(1);
  });

  test('can list multiple taught lessons', () => {
    const teacher = teach();

    ctx.app.lessons = [{name: 'Lesson 1'}, {name: 'Lesson 2'}];
    ctx.path = '/assess';

    teacher(ctx, noop);
    expect(ctx.body.lessons).toHaveLength(2);
  });
});

describe('teaching', () => {
  let ctx = {};
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

  test('a single lesson is possible', () => {
    const step = 'google.com';
    const teacher = teach();

    ctx.path = '/teach';
    ctx.body = {lessons: {steps: step}};

    teacher(ctx, noop);
    expect(ctx.app.lessons).toHaveLength(1);
  });

  test('multiple lessons is possible', () => {
    const step = 'google.com';
    const teacher = teach();

    ctx.path = '/teach';
    ctx.body = {lessons: [{steps: step}, {steps: step}]};

    teacher(ctx, noop);
    expect(ctx.app.lessons).toHaveLength(2);
  });

  test('by default, uses the /teach route', () => {
    const teacher = teach();

    ctx.path = '/nonexistent/path';

    teacher(ctx, noop);
    expect(ctx.status).toBe(404);

    ctx.path = '/teach';
    teacher(ctx, noop);
    expect(ctx.status).toBe(200);
  });

  test('uses the route specified', () => {
    const route = '/some/path';
    const teacher = teach({post: route});

    teacher(ctx, noop);
    expect(ctx.status).toBe(404);

    ctx.path = '/some/path';
    teacher(ctx, noop);
    expect(ctx.status).toBe(200);
  });
});

describe('unteaching', () => {
  let ctx = {};
  beforeEach(() => {
    ctx = {app: {lessons: [{name: 'Lesson 1'}, {name: 'Lesson 2'}, {name: 'Lesson 3'}]}, status: 404, method: 'DELETE'};
  });

  test('adds a slash at the beginning of the specified route for convenience', () => {
    const route = 'some/path';
    const teacher = teach({delete: route});

    ctx.path = '/some/path';

    teacher(ctx, noop);
    expect(ctx.status).toBe(200);
  });

  test('by default, uses the /unteach route', () => {
    const teacher = teach();

    teacher(ctx, noop);
    expect(ctx.status).toBe(404);

    ctx.path = '/unteach';
    teacher(ctx, noop);
    expect(ctx.status).toBe(200);
  });

  test('uses the route specified', () => {
    const route = '/some/path';
    const teacher = teach({delete: route});

    teacher(ctx, noop);
    expect(ctx.status).toBe(404);

    ctx.path = '/some/path';
    teacher(ctx, noop);
    expect(ctx.status).toBe(200);
  });

  test('can unteach no lessons', () => {
    const teacher = teach();
    ctx.path = '/unteach';

    teacher(ctx, noop);
    expect(ctx.app.lessons).toHaveLength(3);
  });

  test('unteaches no lessons when no taught lessons match', () => {
    const teacher = teach();

    ctx.path = '/unteach';
    ctx.body = {lessons: 'Lesson 4'};
    teacher(ctx, noop);
    expect(ctx.app.lessons).toHaveLength(3);
  });

  test('can unteach a single lesson', () => {
    const teacher = teach();

    ctx.path = '/unteach';
    ctx.body = {lessons: 'Lesson 1'};
    teacher(ctx, noop);
    expect(ctx.app.lessons).toHaveLength(2);
  });

  test('can unteach multiple lessons from previous requests', () => {
    const teacher = teach();

    ctx.path = '/unteach';
    ctx.body = {lessons: ['Lesson 1', 'Lesson 2']};
    teacher(ctx, noop);
    expect(ctx.app.lessons).toHaveLength(1);
  });
});
