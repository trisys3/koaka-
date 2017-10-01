import Lesson from '../teach';

export default ({route = '/assess', delete: deleteRoute = '/unteach', post: postRoute = '/teach'} = {}) => {
  if(!route.startsWith('/')) {
    route = `/${route}`;
  }
  if(!postRoute.startsWith('/')) {
    postRoute = `/${postRoute}`;
  }
  if(!deleteRoute.startsWith('/')) {
    deleteRoute = `/${deleteRoute}`;
  }

  return (ctx, next) => {
    ctx.body = ctx.body || {};
    const {app: server, method = 'GET', path, body} = ctx;

    if(!Array.isArray(server.lessons)) {
      if(server.lessons) {
        server.lessons = [server.lessons];
      } else {
        server.lessons = [];
      }
    }

    const reqLessons = server.lessons;

    if(!Array.isArray(body.lessons)) {
      if(body.lessons) {
        body.lessons = [body.lessons];
      } else {
        body.lessons = [];
      }
    }

    if(method === 'GET') {
      if(path !== route) {
        return next();
      }
      ctx.status = 200;

      body.lessons = [...body.lessons, ...reqLessons];

      return next();
    }

    if(method === 'POST') {
      if(ctx.path !== postRoute) {
        return next();
      }
      ctx.status = 200;

      reqLessons.push(...body.lessons.map(lesson => new Lesson(lesson)));

      return next();
    }

    if(method === 'DELETE') {
      if(ctx.path !== deleteRoute) {
        return next();
      }
      ctx.status = 200;

      for(const lessonName of body.lessons) {
        const lessonIndex = reqLessons
          .findIndex(lesson => lessonName === lesson.name);
        if(~lessonIndex) {
          reqLessons.splice(lessonIndex, 1);
        }
      }

      return next();
    }
  };
};
