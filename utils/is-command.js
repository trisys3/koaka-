import isUrl from './is-url';

export default command => {
  if(typeof command !== 'string') {
    return false;
  }

  return !isUrl(command);
};
