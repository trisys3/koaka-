export {filterHost};

export default vhosts => {
  if(typeof vhosts === 'string') {
    vhosts = [vhosts];
  }

  if(!Array.isArray(vhosts)) {
    return (ctx, next) => next();
  }

  vhosts = vhosts.filter(host => typeof host === 'string');

  return ({hostname}, next) => {
    if(!vhosts.length) {
      return next();
    }

    if(filterHost(vhosts, hostname)) {
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
