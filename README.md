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
import Koa from Koa;
import koakaThing from 'koaka-thing';

const server = new Koa();

server.use(koakaThing.teach);

// preconfigure a behavior with a request
koakaThing.behaviors.push({
  name: 'requestEggs',
  request: '//grocerystore.com/eggs',
});

// preconfigure a behavior with multiple requests
koakaThing.behaviors.push({
  name: 'tellRobotButlerToRetrieveEggs',
  requests: [
    '//robotbutler.my/open-door',
    '//robotbutler.my/pick-up-package',
    '//robotbutler.my/take-eggs-to-refrigerator',
  ],
});

// preconfigure a behavior from previous behaviors
koakaThing.behaviors.push({
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
`koaka thing [[--name || -n] name] [[--ip || -i] domain name || IP]`: Start up a simple koa server and start taking requests. If using a domain or IP, the device must be accessible from there.

`koaka thing behavior(s) [[--name || -n] server name] -- [[--behaviors || -b] ...behavior list]`: Add one or multiple behaviors. The behavior can also be called from the CLI with a later command, with or without running the server. Generally the same as preconfiguring them when creating the server: `[name] --request(s) [URL] [name] --command(s) [command]`, etc. This option probably won't be used that much, as it is much easier to preconfigure or send requests directly to the server. For example:

    koaka thing behavior -n koaka.my -- getEggs --request '//grocerystore.com/eggs' tellRobotButlerToGetEggs --requests '//robotbutler.my/open-door' '//robotbutler.my/pick-up-package' '//robotbutler.my/take-eggs-to-refrigerator'

`koaka thing do [name]`: Call a command created via the `/teach` endpoint, documented below, or the `behavior(s)` command, documented above. For example, if `getEggsWithoutGettingUpFromChair` is created through either of these means, it can be called with:

    koaka do getEggsWithoutGettingUpFromChair

# node API

```
import Koa from 'koa';
import request from 'request';
import {teach, server, behavior, behaviors} from 'koaka-thing';

behavior === behaviors;

const mwServer = new Koa();
mwServer.use(teach);
mwServer.listen(3000);

request.post('http://localhost:3000/teach', {
  json: true,
  body: {
    behaviors: [{
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
// "request" & "requests" are the same, and both take a string or array of
// strings. "behavior" & "behaviors" are also the same, and take an object or
// an array of objects. If an object, and it has a "name" property, that is
// assumed to be the name of the behavior. Otherwise, the object is assumed to
// be a hash of behaviors, with each key as the name, as below.

// The behaviors are kept around for convenience. They can be changed from
// the outside, but `koaka` keeps track of the state.
console.log(behaviors);
// [ { name: 'getEggs', request: [ 'http://grocerystore.com/eggs' ], requests: [ 'http://grocerystore.com/eggs' ] }, { name: 'tellRobotButlerToRetrieveEggs', command: ['koaka do requestEggs', 'sleep 2h', 'koaka do controlRobot'], commands: ['koaka do requestEggs', 'sleep 2h', 'koaka do controlRobot' ] } ]

request.post('http://localhost:3000/teach', {
  json: true,
  body: {
    behavior: {
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

console.log(behaviors[2]);
// [ { name: 'getEggsWithoutGettingUpFromChair', command: [ 'koaka do requestEggs', 'sleep 2h', 'koaka do controlRobot' ], commands: [ 'koaka do requestEggs', 'sleep 2h', 'koaka do controlRobot' ] } ]

// If the server is accessible via http://koaka.my, we can call one of these
// behaviors via the CLI, as documented above, or with an HTTP request, like
// so:
request.get('http://koaka.my/getEggsWithoutGettingUpFromChair');

// {server} is a simple koa server with several middlewares like compression,
// administration routes like /login, and the teach middleware from
// above. Using it like this is the same as calling `koaka thing -n koaka.my`.
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
