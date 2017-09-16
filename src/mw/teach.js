import Lesson from '../teach';

export default (name, lessons) => {
  if(!lessons) {
    lessons = name;
    name = undefined;
  }
  if(!Array.isArray(lessons)) {
    if(lessons) {
      lessons = [lessons];
    } else {
      lessons = [];
    }
  }

  if(typeof name === 'string' && lessons[0]) {
    lessons[0].name = name;
  }

  let taught = false;

  return (ctx, next) => {
    if(!Array.isArray(ctx.lessons)) {
      ctx.lessons = [];
    }

    if(!taught) {
      ctx.lessons.push(...lessons.map(lesson => new Lesson(lesson)));
    }

    taught = true;

    if(ctx.path !== '/teach') {
      return next();
    }

    const newLessons = [];

    if(ctx.query && ctx.query.lessons) {
      let queryLessons = ctx.query.lessons;

      if(!Array.isArray(queryLessons)) {
        queryLessons = [queryLessons];
      }

      newLessons.push(...queryLessons);
    }

    if(ctx.body && ctx.body.lessons) {
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
