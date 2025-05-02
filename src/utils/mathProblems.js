const OPERATORS = {
  addition: "+",
  subtraction: "-",
  multiplication: "×",
  division: "÷",
};

const generateNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateOperator = (availableOperations) => {
  return availableOperations[
    Math.floor(Math.random() * availableOperations.length)
  ];
};

const calculateAnswer = (num1, num2, operator) => {
  switch (operator) {
    case OPERATORS.addition:
      return num1 + num2;
    case OPERATORS.subtraction:
      return num1 - num2;
    case OPERATORS.multiplication:
      return num1 * num2;
    case OPERATORS.division:
      return Math.round((num1 / num2) * 100) / 100; // Round to 2 decimal places
    default:
      return 0;
  }
};

const generateProblem = (difficulty, availableOperations = ["addition"]) => {
  let num1, num2;

  const operation = generateOperator(availableOperations);

  switch (difficulty) {
    case "easy":
      if (operation === "addition") {
        num1 = generateNumber(1, 20);
        num2 = generateNumber(1, Math.min(9, 100 - num1));
      } else if (operation === "subtraction") {
        num2 = generateNumber(1, 9);
        num1 = generateNumber(num2, 20);
      } else if (operation === "multiplication") {
        num1 = generateNumber(0, 5);
        num2 = generateNumber(0, 5);
      } else {
        // division
        num2 = generateNumber(1, 5);
        num1 = generateNumber(1, 5);
        const product = num1 * num2;
        num1 = product; // We want to present it as product ÷ num2 = ?
      }
      break;

    case "medium":
      if (operation === "addition") {
        num1 = generateNumber(10, 50);
        num2 = generateNumber(1, Math.min(9, 100 - num1));
      } else if (operation === "subtraction") {
        num2 = generateNumber(1, 9);
        num1 = generateNumber(num2, 50);
      } else if (operation === "multiplication") {
        num1 = generateNumber(0, 7);
        num2 = generateNumber(0, 7);
      } else {
        // division
        num2 = generateNumber(1, 7);
        num1 = generateNumber(1, 7);
        const product = num1 * num2;
        num1 = product;
      }
      break;

    case "hard":
      if (operation === "addition") {
        num1 = generateNumber(20, 90);
        num2 = generateNumber(1, Math.min(9, 100 - num1));
      } else if (operation === "subtraction") {
        num2 = generateNumber(1, 9);
        num1 = generateNumber(num2, 100);
      } else if (operation === "multiplication") {
        num1 = generateNumber(0, 10);
        num2 = generateNumber(0, 10);
      } else {
        // division
        num2 = generateNumber(1, 10);
        num1 = generateNumber(1, 10);
        const product = num1 * num2;
        num1 = product;
      }
      break;

    default: {
      num1 = generateNumber(1, 10);
      num2 = generateNumber(1, 10);
      const defaultOperation = "addition";
      return {
        problem: `${num1} ${OPERATORS[defaultOperation]} ${num2}`,
        correctAnswer: calculateAnswer(num1, num2, OPERATORS[defaultOperation]),
        answers: shuffleArray([
          num1 + num2,
          ...generateWrongAnswers(num1 + num2, "easy"),
        ]),
      };
    }
  }

  const correctAnswer =
    operation === "division"
      ? num1 / num2
      : calculateAnswer(num1, num2, OPERATORS[operation]);
  const wrongAnswers = generateWrongAnswers(correctAnswer, difficulty);

  return {
    problem: `${num1} ${OPERATORS[operation]} ${num2}`,
    correctAnswer,
    answers: shuffleArray([correctAnswer, ...wrongAnswers]),
  };
};

const generateWrongAnswers = (correctAnswer, difficulty) => {
  const wrongAnswers = new Set();
  const range =
    {
      easy: 5,
      medium: 10,
      hard: 20,
    }[difficulty] || 5;

  while (wrongAnswers.size < 3) {
    let wrongAnswer = correctAnswer + generateNumber(-range, range);
    if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
      wrongAnswers.add(wrongAnswer);
    }
  }

  return Array.from(wrongAnswers);
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export { generateProblem, OPERATORS };
