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
    const {app: server, method = 'GET', path, body, request: req} = ctx;
    req.body = req.body || {};

    if(method === 'GET') {
      if(path !== route) {
        return next();
      }
      ctx.status = 200;

      body.lessons = body.lessons || {};
      Object.assign(body.lessons, server.lessons);

      return next();
    }

    if(method === 'POST') {
      if(ctx.path !== postRoute) {
        return next();
      }
      ctx.status = 200;

      server.lessons = server.lessons || {};
      Object.assign(server.lessons, req.body.lessons);
      body.lessons = req.body.lessons;

      return next();
    }

    // other HTTP verbs don't matter
    // istanbul ignore else
    if(method === 'DELETE') {
      if(ctx.path !== deleteRoute) {
        return next();
      }
      ctx.status = 200;

      if(!Array.isArray(req.body.lessons)) {
        req.body.lessons = [];
      }

      for(const lessonName in server.lessons) {
        if(!req.body.lessons.includes(lessonName)) {
          continue;
        }

        delete server.lessons[lessonName];
      }

      return next();
    }
  };
};
