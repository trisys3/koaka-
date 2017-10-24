const protocols = ['http', 'https', 'ftp', 'ftps'];

const protocolRegex = /^[a-z]+:\/\//;
const domainRegex = /^(localhost|[^. /]+?\.[^. /]+?)/;

export default url => {
  if(typeof url !== 'string') {
    return false;
  }

  [url] = url.split('?', 1);
  const protocol = protocols.find(protocol => url.startsWith(`${protocol}://`));
  if(!protocol && url.match(protocolRegex)) {
    return false;
  }
  if(protocol) {
    [, url] = url.split(`${protocol}://`);
  }

  if(url === 'localhost') {
    return true;
  }

  return !!url.match(domainRegex);
};
