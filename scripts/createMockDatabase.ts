import { Chapter } from '../src/models/Chapter';
import { Question } from '../src/models/Question';
import { Quiz, QuizModel } from '../src/models/Quiz';
import { Reward, RewardModel } from '../src/models/Reward';
import { User, UserModel } from '../src/models/User';
import DatabaseService from '../src/services/DatabaseService';
import AdminService from './services/AdminService';
import UserService from './services/UserService';

interface MockQuestion extends Partial<Question> {}

interface MockQuiz extends Partial<Quiz> {
    title: string;
    points: number;
    questions: MockQuestion[];
}

interface MockChapter extends Partial<Chapter> {
    title: string;
    quizzes: MockQuiz[];
}

interface MockQuizzesDatabase {
    chapters: MockChapter[];
}

interface MockReward extends Partial<Reward> {}

interface MockUser extends Partial<User> {}

const MockUsers: MockUser[] = [
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@mail.com',
        password: 'password',
    },
    {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@mail.com',
        password: 'password',
    },
    {
        firstName: 'Peter',
        lastName: 'Ghost',
        email: 'pghost@mail.com',
        password: 'password',
    },
    {
        firstName: 'Bartek',
        lastName: 'Chadrys',
        email: 'bchadrys@mail.com',
        password: 'password',
    },
    {
        firstName: 'Igor',
        lastName: 'Jonski',
        email: 'ijonski@mail.com',
        password: 'password',
    },
    {
        firstName: 'Aleksander',
        lastName: 'Golus',
        email: 'agolus@mail.com',
        password: 'password',
    },
    {
        firstName: 'Mateusz',
        lastName: 'Kłos',
        email: 'mklos@mail.com',
        password: 'password',
    },
    {
        firstName: 'Jakub',
        lastName: 'Misko',
        email: 'jmisko@mail.com',
        password: 'password',
    },
];

const MockRewards: MockReward[] = [
    {
        cost: 100,
        description: 'A free coffee',
    },
    {
        cost: 200,
        description: 'A free pizza',
    },
    {
        cost: 300,
        description: 'A free beer',
    },
    {
        cost: 400,
        description: 'A free burger',
    },
    {
        cost: 500,
        description: 'A free salad',
    },
    {
        cost: 600,
        description: 'A free sandwich',
    },
    {
        cost: 700,
        description: 'A free ice cream',
    },
    {
        cost: 800,
        description: 'A free cake',
    },
    {
        cost: 900,
        description: 'A free hot dog',
    },
    {
        cost: 1000,
        description: 'A free kebab',
    },
];

const VariablesMockQuizzes: MockQuiz[] = [
    {
        title: 'Integers and Floats',
        points: 50,
        questions: [
            {
                description: 'What is the result of 1 + 1?',
                answers: ['2', '3', '4', '5'],
                correctAnswerIndex: 0,
            },
            {
                description: 'What is the main characteristic of a float?',
                answers: [
                    'It can be positive or negative',
                    'It can be a whole number',
                    'It can be a decimal number',
                    'It can be a fraction',
                ],
                correctAnswerIndex: 2,
            },
            {
                description: 'Why is 1.0 a float?',
                answers: [
                    'Because it has a decimal point',
                    'Because it is a whole number',
                    'Because it is a fraction',
                    'Because it is a negative number',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Doubles, shorts and longs',
        points: 50,
        questions: [
            {
                description: 'What is the main characteristic of a double?',
                answers: [
                    'It can be positive or negative',
                    'It can be a whole number',
                    'It can be a decimal number',
                    'It can be a fraction',
                ],
                correctAnswerIndex: 2,
            },
            {
                description: 'What is the main characteristic of a short?',
                answers: [
                    'It can be positive or negative',
                    'It can be a whole number',
                    'It can be a decimal number',
                    'It can be a fraction',
                ],
                correctAnswerIndex: 0,
            },
            {
                description: 'What is the main characteristic of a long?',
                answers: [
                    'It can be positive or negative',
                    'It can be a whole number',
                    'It can be a decimal number',
                    'It can be a fraction',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Strings',
        points: 70,
        questions: [
            {
                description: 'What is the result of "Hello" + "World"?',
                answers: ['HelloWorld', 'Hello World', 'Hello + World', 'HelloWorld!'],
                correctAnswerIndex: 0,
            },
            {
                description: 'What is the result of "Hello" + " " + "World"?',
                answers: ['HelloWorld', 'Hello World', 'Hello + World', 'HelloWorld!'],
                correctAnswerIndex: 1,
            },
            {
                description: 'What is the result of "Hello" + "World" + "!"?',
                answers: ['HelloWorld', 'Hello World', 'Hello + World', 'HelloWorld!'],
                correctAnswerIndex: 3,
            },
        ],
    },
    {
        title: 'Booleans',
        points: 50,
        questions: [
            {
                description: 'What is the result of true && true?',
                answers: ['true', 'false', 'null', 'undefined'],
                correctAnswerIndex: 0,
            },
            {
                description: 'What is the result of true && false?',
                answers: ['true', 'false', 'null', 'undefined'],
                correctAnswerIndex: 1,
            },
            {
                description: 'What is the result of false && false?',
                answers: ['true', 'false', 'null', 'undefined'],
                correctAnswerIndex: 1,
            },
        ],
    },
    {
        title: 'Arrays',
        points: 50,
        questions: [
            {
                description: 'What is the result of [1, 2, 3, 4, 5].length?',
                answers: ['1', '2', '3', '5'],
                correctAnswerIndex: 3,
            },
            {
                description: 'What is the result of [1, 2, 3, 4, 5][0]?',
                answers: ['1', '2', '3', '5'],
                correctAnswerIndex: 0,
            },
            {
                description: 'What is the result of [1, 2, 3, 4, 5][4]?',
                answers: ['1', '2', '3', '5'],
                correctAnswerIndex: 3,
            },
        ],
    },
];

const FunctionsMockQuizzes: MockQuiz[] = [
    {
        title: 'Functions',
        points: 50,
        questions: [
            {
                description: "How do you define a void function called 'myFunction'?",
                answers: ['void myFunction()', 'void = myFunction()', 'void myFunction', 'void = myFunction'],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Methods',
        points: 50,
        questions: [
            {
                description: "How do you define a void method called 'myMethod'?",
                answers: ['void myMethod()', 'void = myMethod()', 'void myMethod', 'void = myMethod'],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Parameters',
        points: 70,
        questions: [
            {
                description: "How do you define a void function called 'myFunction' with an integer parameter?",
                answers: [
                    'void myFunction(int parameter)',
                    'void = myFunction(parameter int)',
                    'void myFunction(parameter int)',
                    'void = myFunction(int parameter)',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Return values',
        points: 50,
        questions: [
            {
                description: "How do you define a function called 'myFunction' that returns an integer?",
                answers: ['int myFunction()', 'int = myFunction()', 'int myFunction', 'int = myFunction'],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Recursion',
        points: 100,
        questions: [
            {
                description: 'What is recursion?',
                answers: [
                    'A function that calls itself',
                    'A function that calls another function',
                    'A function that returns a value',
                    'A function that takes parameters',
                ],
                correctAnswerIndex: 0,
            },
            {
                description: 'What is the result of 5!?',
                answers: ['5', '10', '15', '120'],
                correctAnswerIndex: 3,
            },
            {
                description: "What is the most famous example of a recursive function's use?",
                answers: [
                    'The Fibonacci sequence',
                    'The factorial function',
                    'The exponentiation function',
                    'The square root function',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
];

const ClassesMockQuizzes: MockQuiz[] = [
    {
        title: 'Classes',
        points: 50,
        questions: [
            {
                description: 'How do you define a class called "MyClass"?',
                answers: ['class MyClass {}', 'class = MyClass {}', 'class MyClass', 'class = MyClass'],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Constructors',
        points: 50,
        questions: [
            {
                description: 'How do you define a constructor for a class called "MyClass"?',
                answers: [
                    'class MyClass { constructor() {} }',
                    'class = MyClass { constructor() {} }',
                    'class MyClass { constructor }',
                    'class = MyClass { constructor }',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Inheritance',
        points: 70,
        questions: [
            {
                description: 'How do you define a class called "MyClass" that inherits from "MyParentClass"?',
                answers: [
                    'class MyClass extends MyParentClass {}',
                    'class = MyClass extends MyParentClass {}',
                    'class MyClass extends MyParentClass',
                    'class = MyClass extends MyParentClass',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Interfaces',
        points: 50,
        questions: [
            {
                description: 'How do you define an interface called "MyInterface"?',
                answers: [
                    'interface MyInterface {}',
                    'interface = MyInterface {}',
                    'interface MyInterface',
                    'interface = MyInterface',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Polymorphism',
        points: 100,
        questions: [
            {
                description: 'What is polymorphism?',
                answers: [
                    'The ability of an object to take on many forms',
                    'The ability of an object to take on one form',
                    'The ability of an object to take on two forms',
                    'The ability of an object to take on three forms',
                ],
                correctAnswerIndex: 0,
            },
            {
                description: 'What is the result of 1 + 1?',
                answers: ['2', '3', '4', '5'],
                correctAnswerIndex: 0,
            },
            {
                description: 'What is the result of "Hello" + "World"?',
                answers: ['HelloWorld', 'Hello World', 'Hello + World', 'HelloWorld!'],
                correctAnswerIndex: 0,
            },
        ],
    },
];

const LoopsMockQuizzes: MockQuiz[] = [
    {
        title: 'For loops',
        points: 50,
        questions: [
            {
                description: 'What are the three parts of a for loop?',
                answers: [
                    'Initialization, condition, increment',
                    'Initialization, condition, decrement',
                    'Initialization, condition, multiplication',
                    'Initialization, condition, division',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'While loops',
        points: 50,
        questions: [
            {
                description: 'What are the two parts of a while loop?',
                answers: [
                    'Condition, code block',
                    'Condition, increment',
                    'Condition, multiplication',
                    'Condition, division',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Do while loops',
        points: 70,
        questions: [
            {
                description: 'What is the difference between a while loop and a do while loop?',
                answers: [
                    'The while loop checks condition before executing code block, do while loop checks condition after executing code block',
                    'The while loop checks condition after executing code block, do while loop checks condition before executing code block',
                    'The while loop checks condition before executing code block, do while loop checks condition before executing code block',
                    'The while loop checks condition after executing code block, do while loop checks condition after executing code block',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Nested loops',
        points: 50,
        questions: [
            {
                description: 'What is a nested loop?',
                answers: [
                    'A loop inside another loop',
                    'A loop that is executed multiple times',
                    'A loop that is executed once',
                    'A loop that is executed twice',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
    {
        title: 'Break and continue',
        points: 100,
        questions: [
            {
                description: 'What is the difference between break and continue?',
                answers: [
                    'Break stops the loop, continue skips the current iteration',
                    'Break skips the current iteration, continue stops the loop',
                    'Break stops the loop, continue stops the loop',
                    'Break skips the current iteration, continue skips the current iteration',
                ],
                correctAnswerIndex: 0,
            },
        ],
    },
];

const MockChapters: MockChapter[] = [
    {
        title: 'Variables',
        quizzes: VariablesMockQuizzes,
    },
    {
        title: 'Functions',
        quizzes: FunctionsMockQuizzes,
    },
    {
        title: 'Classes',
        quizzes: ClassesMockQuizzes,
    },
    {
        title: 'Loops',
        quizzes: LoopsMockQuizzes,
    },
];

const MockQuizzesDatabase: MockQuizzesDatabase = {
    chapters: MockChapters,
};

const addRewards = async () => {
    const adminService = new AdminService();
    MockRewards.forEach(async (reward) => {
        await adminService.addReward({
            cost: reward.cost,
            description: reward.description,
        });
    });
};

const addUsers = async () => {
    const adminService = new AdminService();
    MockUsers.forEach(async (user) => {
        await adminService.addUser({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
        });
    });
};

const addQuizzesDatabase = async () => {
    const adminService = new AdminService();

    MockChapters.forEach(async (thisChapter) => {
        //add chapter
        const chapterId = await adminService.addChapter({ title: thisChapter.title });

        //add quizzes
        thisChapter.quizzes.forEach(async (thisQuiz) => {
            const quizId = await adminService.addQuiz({ title: thisQuiz.title, points: thisQuiz.points, chapterId });

            //add questions
            thisQuiz.questions.forEach(async (thisQuestion) => {
                await adminService.addQuestion({
                    description: thisQuestion.description,
                    answers: thisQuestion.answers,
                    correctAnswerIndex: thisQuestion.correctAnswerIndex,
                    quizId,
                });
            });
        });
    });
};

const addRewardsToUsers = async () => {
    const users = await UserModel.find();
    const rewards = await RewardModel.find();
    const userService = new UserService();

    users.forEach(async (user) => {
        const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
        await userService.addRewardToUser(user._id, randomReward._id);
    });
};

const addQuizzesDoneToUsers = async () => {
    const users = await UserModel.find();
    const quizzes = await QuizModel.find();
    const userService = new UserService();

    //add 10 finished quizzes to each user
    for (let i = 0; i < 10; i++) {
        users.forEach(async (user) => {
            try {
                const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
                await userService.finishQuizByUser(user._id, randomQuiz._id);
                if (await userService.shouldUserFinishChapter(user._id, randomQuiz.chapterId)) {
                    await userService.finishChapterByUser(user._id, randomQuiz.chapterId);
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
};

(async () => {
    await DatabaseService.connect();
    await addRewards();
    console.info('🎁 Added rewards');
    await addUsers();
    console.info('👨‍🎓 Added users');
    await addQuizzesDatabase();
    console.info('📚 Added quizzes');
    await addRewardsToUsers();
    console.info('🎁 Added rewards to users');
    await addQuizzesDoneToUsers();
    console.info('📚 Added quizzes done to users');
    console.info('🗄️ Created mock database');
    await new Promise((resolve) => setTimeout(resolve, 5000)); //otherwise: Error: Client must be connected before running operations
    await DatabaseService.disconnect();
})();
