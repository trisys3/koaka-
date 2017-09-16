export {filterHost};

export default vhosts => ({hostname}, next) => {
  if(filterHost(vhosts, hostname)) {
    return next();
  }
};

function filterHost(test, actual) {
  if(test instanceof RegExp) {
    return actual.match(test);
  }
  if(typeof test === 'string') {
    return actual === test;
  }

  let tests = test;
  if(!Array.isArray(tests)) {
    return true;
  }

  tests = tests.filter(test => typeof test === 'string');
  if(!tests.length) {
    return true;
  }

  return tests.some(test => filterHost(test, actual));
}
