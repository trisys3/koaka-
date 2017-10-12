import {run as runCmd} from 'node-run-cmd';
import request from 'request-promise-native';

import {isUrl, isCommand} from '../utils';

export default () =>
  async (ctx, next) => {
    const {app, path} = ctx;
    const lessons = app.lessons = app.lessons || {};

    let steps;
    for(const lesson in lessons) {
      if(path === `/${lesson}`) {
        steps = lessons[lesson];
        break;
      }
    }

    if(!Array.isArray(steps)) {
      if(steps) {
        steps = [steps];
      } else {
        steps = [];
      }
      if(!steps.length) {
        return next();
      }
    }

    const lessonOut = ctx.body.lessons = [];
    const lessonPromises = steps.map((step, stepIndex) => new Promise(async (resolve, reject) => {
      let shell;
      let type;

      if(typeof step !== 'string') {
        ({type, shell, step} = step);
      }

      if(!type) {
        if(isUrl(step)) {
          type = 'url';
        } else if(isCommand(step)) {
          type = 'command';
        }
      }

      switch(type) {
        case 'command': {
          const util = require('util');
          const exec = util.promisify(require('child_process').exec);
          if(shell) {
            step = `${shell} -c "${step}"`;
          }

          try {
            const {stdout} = await exec(step);
            lessonOut[stepIndex] = stdout;
            return resolve(stdout);
          } catch({stderr}) {
            lessonOut[stepIndex] = stderr;
            return reject(stderr);
          }
        } case 'url': {
          if(!step.match(/^https?:\/\//)) {
            step = `http://${step}`;
          }

          try {
            const resp = await request(step);
            lessonOut[stepIndex] = resp;
            return resolve(resp);
          } catch(error) {
            lessonOut[stepIndex] = error;
            return reject(error);
          }
        } default: {
          reject(new Error('Can\'t quiz steps other than commands and URL\'s'));
        }
      }
    }));

    try {
      await Promise.all(lessonPromises);
      ctx.status = 200;
    } catch(error) {}

    return next();
  };
