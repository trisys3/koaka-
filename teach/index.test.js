jest.mock('request-promise-any');
jest.mock('node-run-cmd');

import request from 'request-promise-any';
import * as nrc from 'node-run-cmd';

import teach, {Lesson} from '.';

describe('A lesson', () => {
  test('can be given a name', () => {
    const lessonName = 'Lesson Name';
    const lesson = new Lesson({name: lessonName});
    expect(lesson).toHaveProperty('name', lessonName);
  });

  test('always has a name', () => {
    const lesson = new Lesson();
    expect(lesson).toHaveProperty('name');
  });

  test('that is empty has no steps', () => {
    const {steps} = new Lesson();
    expect(steps).toHaveLength(0);
  });

  describe('with a step', () => {
    test('that is a string keeps it', () => {
      const inputStep = 'my.url';
      const {steps} = new Lesson({steps: inputStep});

      expect(steps).toContain(inputStep);
    });

    test('that is an array of strings keeps them', () => {
      const inputStep = 'my.url';
      const inputSteps = [inputStep];
      const {steps} = new Lesson({steps: inputSteps});

      expect(steps).toContain(inputStep);
    });

    test('that is not a string does not keep it', () => {
      const inputStep = 1;
      const {steps} = new Lesson({steps: inputStep});

      expect(steps).toHaveLength(0);
    });

    test('that is an array of non-strings does not keep them', () => {
      const inputStep = 1;
      const inputSteps = [inputStep];
      const {steps} = new Lesson({requests: inputSteps});

      expect(steps).toHaveLength(0);
    });
  });
});

describe('teaching', () => {
  test('with only a name results in a lesson with the name', () => {
    const lessonName = 'Some Name';
    const lesson = teach(lessonName);
    expect(lesson).toBeInstanceOf(Lesson);
    expect(lesson).toHaveProperty('name', lessonName);
  });

  test('a lesson results in that lesson being taught', () => {
    const lesson = new Lesson();
    const taughtLesson = teach(lesson);
    expect(taughtLesson).toBeInstanceOf(Lesson);
  });

  test('a lesson with a name results in a lesson with that name', () => {
    const lessonName = 'my lesson';
    const lesson = new Lesson({name: 'other lesson name'});
    const taughtLesson = teach(lessonName, lesson);
    expect(taughtLesson).toBeInstanceOf(Lesson);
    expect(taughtLesson).toHaveProperty('name', lessonName);
  });

  test('always results in a lesson', () => {
    const lesson = teach();
    expect(lesson).toBeInstanceOf(Lesson);
  });
});

describe('a request', () => {
  test('can be made', async () => {
    const url = 'http://google.com';
    expect.assertions(1);

    try {
      await Lesson.request(url);
      return expect(request).toHaveBeenCalled();
    } catch(error) {}
  });
});

describe('a command', () => {
  const runCmd = jest.spyOn(nrc, 'run');

  test('can be run', async () => {
    const command = 'echo \'Hello world\'';
    expect.assertions(1);

    try {
      await Lesson.run(command);
      return expect(runCmd).toHaveBeenCalled();
    } catch(error) {}
  });
});

describe('running through a lesson', () => {
  const url = 'http://google.com';
  const command = 'echo \'Hello world!\'';

  const requestRun = jest.spyOn(Lesson, 'request');
  const run = jest.spyOn(Lesson, 'run');

  beforeEach(() => {
    requestRun.mockClear();
    run.mockClear();
  });

  test('with a request makes the request', async () => {
    expect.assertions(1);

    const lesson = new Lesson({steps: url});
    try {
      await lesson.do();
    } finally {
      return expect(requestRun).toHaveBeenCalled();
    }
  });

  test('with a command runs the command', async () => {
    expect.assertions(1);

    const lesson = new Lesson({steps: command});
    try {
      await lesson.do();
    } finally {
      expect(run).toHaveBeenCalled();
    }
  });

  test('with no URL or command runs nothing', async () => {
    expect.assertions(2);

    const lesson = new Lesson();
    try {
      await lesson.do();
    } finally {
      expect(requestRun).not.toHaveBeenCalled();
      expect(run).not.toHaveBeenCalled();
    }
  });
});
