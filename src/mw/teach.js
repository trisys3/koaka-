import Lesson from '../teach';

export default ({name = '', lessons, route = '/teach', delete: deleteRoute =
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
  if(!deleteRoute.startsWith('/')) {
    deleteRoute = `/${deleteRoute}`;
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

    if(method === 'DELETE' && path !== deleteRoute) {
      return next();
    }
    if(method !== 'DELETE' && path !== route) {
      return next();
    }
    ctx.status = 200;

    const {body = {}} = ctx;
    if(!Array.isArray(body.lessons)) {
      if(body.lessons) {
        body.lessons = [body.lessons];
      } else {
        body.lessons = [];
      }
    }

    if(method === 'POST') {
      body.lessons.push(...lessons);
      reqLessons.push(...body.lessons.map(lesson => new Lesson(lesson)));
    } else if(method === 'DELETE') {
      for(const lessonName of body.lessons) {
        const lessonIndex = reqLessons
          .findIndex(lesson => lessonName === lesson.name);
        if(~lessonIndex) {
          reqLessons.splice(lessonIndex, 1);
        }
      }
    }

    return next();
  };
};
