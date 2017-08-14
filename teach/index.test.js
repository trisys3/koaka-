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
