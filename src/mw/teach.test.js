import teach from './teach';

const noop = () => {
  // empty function
};

describe('assessing', () => {
  let ctx = {};
  beforeEach(() => {
    ctx = {app: {}, status: 404, request: {}};
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
    expect(Object.keys(ctx.body.lessons)).toHaveLength(0);
  });

  test('lists all taught lesson', () => {
    const teacher = teach();

    ctx.app.lessons = {'Lesson 1': {}, 'Lesson 2': {}};
    ctx.path = '/assess';

    teacher(ctx, noop);
    expect(Object.keys(ctx.body.lessons)).toHaveLength(2);
  });
});

describe('teaching', () => {
  let ctx = {};
  beforeEach(() => {
    ctx = {app: {}, status: 404, method: 'POST', request: {}};
  });

  test('adds a slash at the beginning of the specified route for convenience', () => {
    const route = 'some/path';
    const teacher = teach({post: route});

    ctx.path = '/some/path';

    teacher(ctx, noop);
    expect(ctx.status).toBe(200);
  });

  test('no lessons teaches nothing', () => {
    const teacher = teach();
    ctx.path = '/teach';
    teacher(ctx, noop);
    expect(Object.keys(ctx.app.lessons)).toHaveLength(0);
  });

  test('some lessons is possible', () => {
    const step = 'google.com';
    const teacher = teach();

    ctx.path = '/teach';
    ctx.request.body = {lessons: {'Lesson 1': step}};

    teacher(ctx, noop);
    expect(Object.keys(ctx.app.lessons)).toHaveLength(1);
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
    ctx = {app: {lessons: {'Lesson 1': {}, 'Lesson 2': {}, 'Lesson 3': {}}}, status: 404, method: 'DELETE', request: {body: {}}};
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
    expect(Object.keys(ctx.app.lessons)).toHaveLength(3);
  });

  test('unteaches no lessons when no taught lessons are found', () => {
    const teacher = teach();

    ctx.path = '/unteach';
    ctx.request.body.lessons = ['Lesson 4'];
    teacher(ctx, noop);
    expect(Object.keys(ctx.app.lessons)).toHaveLength(3);
  });

  test('can unteach lessons', () => {
    const teacher = teach();

    ctx.path = '/unteach';
    ctx.request.body.lessons = ['Lesson 1', 'Lesson 2'];
    teacher(ctx, noop);
    expect(Object.keys(ctx.app.lessons)).toHaveLength(1);
  });
});
