import compose from 'koa-compose';
import compress from 'koa-compress';

const middlewares = [compress];
export default compose(middlewares);
