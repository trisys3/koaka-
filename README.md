# koaka-thing

*This system is not quite finished yet. When it is, it will be the best thing since sliced bread, but until then, please be patient.*

The koaka framework is a batch-processing system for the Internet of Things. It allows you to control your thing by sending it HTTP requests. Your thing will run some commands on itself and deliver you the result when it is finished.

Of course, your thing must know what to do with this request. That is where this module comes in. It is a simple koa server that comes configured with a few routes for administration and logging, and one special POST route, `/teach`. This route is only accessible via localhost by default, and I suggest you be very careful about opening it up. The `/teach` route takes a JSON body with a list of behaviors to allow. This route can also be configured as a GET request or command, details below. The module also includes middleware so you can use in a bigger server.

## Get koaka-thing

    npm i koaka-thing

## Use it as a server:

    koaka thing -i [domain name]

## Use it as a middleware
*NOTE: The example below requires either [babel][] or the latest [webpack][]*:

server.js:

```
import Koa from 'koa';
import {teach} from 'koaka-thing';

const server = new Koa();

server.use(teach());

const behaviors = server.behaviors;

// preconfigure a behavior with a request
behaviors.push({
  name: 'requestEggs',
  request: '//grocerystore.com/eggs',
});

// preconfigure a behavior with multiple requests
behaviors.push({
  name: 'tellRobotButlerToRetrieveEggs',
  requests: [
    '//robotbutler.my/open-door',
    '//robotbutler.my/pick-up-package',
    '//robotbutler.my/take-eggs-to-refrigerator',
  ],
});

// preconfigure a behavior from previous behaviors
behaviors.push({
  name: 'getEggsWithoutGettingUpFromChair',
  commands: [
    'koaka do requestEggs',
    'sleep 2h',
    'koaka do controlRobot',
  ],
});
// (The timing may be a little off here. You may want to set up tracking with
// the grocery store.)
```

# Comprehensive API:

## CLI

`koaka`
`koaka thing [[--name || -n] name] [[--ip || -i] domain name || IP [--middleware || -m]]`: Start up a simple koa server and start taking requests. If using a domain or IP, the device must be accessible from there. if adding any extra middleware, each of these should be a regular node module exporting a `koa`-compatible middleware or an array of such middleware. Any option can also be taken from a `.koakarc` file with `.js`, `.json`, `.yaml`, or no extension. The middleware can also be taken from a `.middlewarerc` or `.mwrc` file with the same extensions.

`koaka thing teach [[--name || -n] server name] -- [[--behaviors || -b] ...behavior list]`: Add one or multiple behaviors. The behavior can also be called from the CLI with a later command, with or without running the server. Generally the same as preconfiguring them when creating the server: `[name] --request(s) [URL] [name] --command(s) [command]`, etc. This option probably won't be used that much, as it is much easier to preconfigure or send requests directly to the server. For example:

    koaka thing teach -n koaka.my -- getEggs --request '//grocerystore.com/eggs' tellRobotButlerToGetEggs --requests '//robotbutler.my/open-door' '//robotbutler.my/pick-up-package' '//robotbutler.my/take-eggs-to-refrigerator'

`koaka thing do [name]`: Call a command created via the `/teach` endpoint, documented below, or the `behavior(s)` command, documented above. For example, if `getEggsWithoutGettingUpFromChair` is created through either of these means, it can be called with:

    koaka do getEggsWithoutGettingUpFromChair

`koaka delete [name]`: Delete the lesson with type `name`.

    koaka delete tellRobotButlerToGetEggs

NOTE: If any other lesson depends on this lesson, that lesson will fail! For example, the `getEggsWithoutGettingUpFromChair` lesson would fail now.

`koaka clear`: Delete all steps from this thing, clearing the server, as well. If the server has any other middleware, these will continue to work. If you are using the built-in server with no other middleware, it will work as if you never taught any behaviors in the first place.

# node API

```
import Koa from 'koa';
import request from 'request';
import Koaka, {teach} from 'koaka-thing';

const server = new Koa();
server.use(teach());
server.listen(3000);

const {steps} = server;

request.post('http://localhost:3000/teach', {
  json: true,
  body: {
    steps: [{
      name: 'getEggs',
      request: '//grocerystore.com/eggs',
    },
    {
      name: 'tellRobotButlerToRetrieveEggs',
      requests: [
        '//robotbutler.my/open-door',
        '//robotbutler.my/pick-up-package',
        '//robotbutler.my/take-eggs-to-refrigerator',
      ],
    }],
  },
});
// "steps" is added onto the server by the
`teach` middleware. It takes an object. If it has a "name" property, that is
// assumed to be the name of the behavior. Otherwise, it is assumed to
// be a hash of steps, with each key as a name.

// The steps are kept around for convenience. They can be changed from
// the outside, but `koaka` keeps track of the state.
console.log(steps);
// { getEggs: { requests: [ 'http://grocerystore.com/eggs' ] }, tellRobotButlerToRetrieveEggs: { commands: ['koaka do requestEggs', 'sleep 2h', 'koaka do controlRobot' ] } }

request.post('http://localhost:3000/teach', {
  json: true,
  body: {
    steps: {
      getEggsWithoutGettingUpFromChair: {
        commands: [
          'koaka do requestEggs',
          'sleep 2h',
          'koaka do controlRobot',
        ],
      },
    },
  },
});

console.log(steps[2]);
// [ { name: 'getEggsWithoutGettingUpFromChair', commands: [ 'koaka do requestEggs', 'sleep 2h', 'koaka do controlRobot' ] } ]

// If the server is accessible via http://koaka.my, we can call one of these
// behaviors via the CLI, as documented above, or with an HTTP request, like
// so:
request.get('http://koaka.my/getEggsWithoutGettingUpFromChair');

// The server itself is a simple koa server with several middlewares like compression,
// administration routes like /login, and the teach middleware from
// above. For example, this is the same as calling `koaka thing -n koaka.my`:
server('koaka.my');
```

# Resources

The `koaka-thing` component was the first part of the `koaka` framework that I created, because I believe it will turn out to be the most important. The other components will come soon.

[koaka-owner-client][] will be  a lightweight client for your devices that mainly communicates with this module.

[koaka-owner-server][] will be another small koa server that will sit between your things and you, allowing easier management and coordination between your various things.

[koaka-core][] will be the "guts" of the framework, allowing a common core between all the different components. Among other things, it will include the `koaka` executable, which the other components, including this one, will use.

The `koaka` framework will also allow [plugins][koaka-plugins]. The API for that is coming soon, as well.

For now, the main resource for questions is the [issues][issues] page.

[babel]: http://babeljs.io
[webpack]: http://webpack.js.org
[koaka-owner-client]: http://github.com/trisys3/koaka-owner-client
[koaka-owner-server]: http://github.com/trisys3/koaka-owner-server
[koaka-core]: http://github.com/trisys3/koaka-core
[koaka-plugins]: http://npms.io/search?q=keywords:koaka
[issues]: http://github.com/trisys3/koaka-thing/issues
