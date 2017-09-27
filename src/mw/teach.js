import Lesson from '../teach';

export default ({name = '', lessons, route = '/teach', deleteRoute =
'/unteach'} = {}) => {
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
    const {state, method = 'GET', path} = ctx;

    if(!Array.isArray(state.lessons)) {
      state.lessons = [];
    }
    const reqLessons = state.lessons;

    if(!taught) {
      reqLessons.push(...lessons.map(lesson => new Lesson(lesson)));
    }

    taught = true;

    if((method === 'GET' || method === 'POST') && path !== route) {
      return next();
    }
    ctx.status = 200;

    if(method === 'POST') {
      const {body = {}} = ctx;
      if(!Array.isArray(body.lessons)) {
        if(body.lessons) {
          body.lessons = [body.lessons];
        } else {
          body.lessons = [];
        }
      }

      body.lessons.push(...lessons);
      reqLessons.push(...body.lessons.map(lesson => new Lesson(lesson)));
    }

    return next();
  };
};
