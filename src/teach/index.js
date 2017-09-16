import request from 'request-promise-any';
import {run as runCmd} from 'node-run-cmd';

import {isUrl, isCommand} from '../utils';

export class Lesson {
  constructor({name, steps} = {}) {
    Object.assign(this, {
      name: name || `lesson-${Date.now()}`,
      steps: [],
    });

    if(Array.isArray(steps)) {
      this.steps.push(...steps
        .filter(step => typeof step === 'string'));
    } else if(typeof steps === 'string') {
      this.steps.push(steps);
    }
  }

  do() {
    const {steps} = this;
    return Promise.all(steps.map(step => {
      /* istanbul ignore else */
      // currently all strings are either URLs or commands, and we must be a
      // string to get this far
      // if this changes, make sure to add more tests
      if(isUrl(step)) {
        return this.constructor.request(step);
      } else if(isCommand(step)) {
        return this.constructor.run(step);
      }
    }));
  }

  static request(url) {
    return request(url);
  }

  static run(command) {
    return runCmd(command);
  }
}

export default function teach(name, lesson) {
  if(lesson == null) {
    if(typeof name === 'string') {
      lesson = {name};
    } else if(name) {
      lesson = name;
    }

    name = null;
  }

  if(lesson && name != null) {
    lesson.name = name;
  }

  return new Lesson(lesson);
}
