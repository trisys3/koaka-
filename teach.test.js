import teach, {Lesson} from './teach';

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

  describe('that is empty', () => {
    const {requests, commands} = new Lesson();

    test('has no requests', () => {
      expect(requests).toHaveLength(0);
    });
 
    test('has no commands', () => {
      expect(commands).toHaveLength(0);
    });
  });

  describe('with a request', () => {
    test('that is a string keeps it', () => {
      const inputRequest = 'my.url';
      const {requests} = new Lesson({requests: inputRequest});

      expect(requests).toContain(inputRequest);
    });

    test('that is an array of strings keeps them', () => {
      const inputRequest = 'my.url';
      const inputRequests = [inputRequest];
      const {requests} = new Lesson({requests: inputRequests});

      expect(requests).toContain(inputRequest);
    });

    test('that is not a string does not keep it', () => {
      const inputRequest = 1;
      const {requests} = new Lesson({requests: inputRequest});

      expect(requests).toHaveLength(0);
    });

    test('that is an array of non-strings does not keep them', () => {
      const inputRequest = 1;
      const inputRequests = [inputRequest];
      const {requests} = new Lesson({requests: inputRequests});

      expect(requests).toHaveLength(0);
    });
  });

  describe('that has a command or commands', () => {
    test('that is a string keeps it', () => {
      const inputCommand = 'my.url';
      const {commands} = new Lesson({commands: inputCommand});

      expect(commands).toContain(inputCommand);
    });

    test('that is an array of strings keeps them', () => {
      const inputCommand = 'my.url';
      const inputCommands = [inputCommand];
      const {commands} = new Lesson({commands: inputCommands});

      expect(commands).toContain(inputCommand);
    });

    test('that is not a string does not keep it', () => {
      const inputCommand = 1;
      const {commands} = new Lesson({commands: inputCommand});

      expect(commands).toHaveLength(0);
    });

    test('that is an array of non-strings does not keep them', () => {
      const inputCommand = 1;
      const inputCommands = [inputCommand];
      const {commands} = new Lesson({commands: inputCommands});

      expect(commands).toHaveLength(0);
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
