export class Lesson {
  constructor({name, requests, commands} = {}) {
    Object.assign(this, {
      name: name || `lesson-${Date.now()}`,
      requests: [],
      commands: [],
    });

    if(Array.isArray(requests)) {
      this.requests.push(...requests
        .filter(request => typeof request === 'string'));
    } else if(typeof requests === 'string') {
      this.requests.push(requests);
    }

    if(Array.isArray(commands)) {
      this.commands.push(...commands
        .filter(command => typeof command === 'string'));
    } else if(typeof commands === 'string') {
      this.commands.push(commands);
    }
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
