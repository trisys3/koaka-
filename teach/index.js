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
