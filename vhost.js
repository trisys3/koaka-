export {filterHost};

export default vhosts => {
  if(typeof vhosts === 'string') {
    vhosts = [vhosts];
  }

  vhosts = vhosts.filter(host => typeof host === 'string');

  return (ctx, next) => {
    if(filterHost(vhosts, ctx.hostname)) {
      return next();
    }
  };
};

function filterHost(test, actual) {
  if(typeof actual !== 'string') {
    throw new Error('Tried to match a non-string hostname!');
  }

  if(Array.isArray(test)) {
    const tests = test;
    return tests.some(test => filterHost(test, actual));
  }

  if(test instanceof RegExp) {
    return actual.match(test);
  }
  if(typeof test === 'string') {
    return actual === test;
  }
}
