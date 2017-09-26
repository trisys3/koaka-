import Lesson from '../teach';

export default ({name = '', lessons, route = '/teach'} = {}) => {
  if(!Array.isArray(lessons)) {
    if(lessons) {
      lessons = [lessons];
    } else {
      lessons = [];
    }
  }

  if(name && lessons[0]) {
    lessons[0].name = name;
  }

  if(!route.startsWith('/')) {
    route = `/${route}`;
  }

  let taught = false;

  return (ctx, next) => {
    // the default method is usually GET, but just to be sure...
    const method = ctx.method || 'GET';

    if(!Array.isArray(ctx.lessons)) {
      ctx.lessons = [];
    }

    if(!taught) {
      ctx.lessons.push(...lessons.map(lesson => new Lesson(lesson)));
    }

    taught = true;

    if(ctx.path !== route) {
      return next();
    }

    const newLessons = [];

    if(method === 'GET') {
      ctx.status = 200;
    }

    if(method === 'POST' && ctx.body && ctx.body.lessons) {
      let bodyLessons = ctx.body.lessons;

      if(!Array.isArray(bodyLessons)) {
        bodyLessons = [bodyLessons];
      }

      newLessons.push(...bodyLessons);
    }

    ctx.lessons.push(...newLessons.map(lesson => new Lesson(lesson)));

    if(ctx.lessons.length) {
      ctx.body = {lessons: ctx.lessons};
      ctx.status = 200;
    }

    return next();
  };
};
