import { useState, useEffect, useCallback } from "react";
import MultiplicationSteps from "../Components/MultiplicationSteps";
import useMathQuestions from "../hooks/useMathQuestions";

export default function MultiplicationTutor() {
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [showNext, setShowNext] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [correctAnswersInSet, setCorrectAnswersInSet] = useState<number>(0);

  const [questionStatuses, setQuestionStatuses] = useState<boolean[]>(
    Array(10).fill(false)
  );

  const { questions, loading, error } = useMathQuestions();

  useEffect(() => {
    if (questions) {
      const currentSetName = `multiplication_${currentSetIndex}`;
      const currentSet = questions[currentSetName as keyof typeof questions];

      if (currentSet && currentQuestionIndex < currentSet.length) {
        const questionToDisplay = currentSet[currentQuestionIndex];
        setNum1(questionToDisplay.number_0);
        setNum2(questionToDisplay.number_1);
        setShowNext(false);
        if (currentQuestionIndex === 0) {
          setQuestionStatuses(Array(10).fill(false));
        }
      } else if (currentSetIndex < 17) {
        handleSetCompletion();
      } else {
        setCurrentSetIndex(0);
        setCurrentQuestionIndex(0);
        setCorrectAnswersInSet(0);
        setQuestionStatuses(Array(10).fill(false));
        setShowNext(false);
      }
    }
  }, [questions, currentSetIndex, currentQuestionIndex]);

  const handleSetCompletion = () => {
    if (correctAnswersInSet === 10) {
      setCurrentSetIndex((prev) => Math.min(prev + 1, 17));
    } else if (correctAnswersInSet >= 6 && correctAnswersInSet <= 9) {
      setCurrentSetIndex((prev) => Math.max(0, prev - 1));
    } else {
      setCurrentSetIndex((prev) => Math.max(0, prev - 1));
    }

    setCorrectAnswersInSet(0);
    setCurrentQuestionIndex(0);

    setQuestionStatuses(Array(10).fill(false));
    setShowNext(false);
  };

  const handleProblemCorrect = useCallback((questionIdx: number) => {
    setCorrectAnswersInSet((prev) => prev + 1);
    setQuestionStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      if (questionIdx >= 0 && questionIdx < newStatuses.length) {
        newStatuses[questionIdx] = true;
      } else {
        console.warn(
          `MultiplicationTutor: Invalid questionIdx received: ${questionIdx}`
        );
      }
      return newStatuses;
    });
    setShowNext(true);
  }, []);

  const handleNextProblem = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setShowNext(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading math questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        <p className="text-xl">Error loading questions: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex justify-center py-2 bg-indigo-200">
        <h2 className="text-xl">Long Multiplication</h2>
      </div>
      <div className="flex justify-center gap-10 items-start min-h-[calc(100vh-64px)] p-4">
        {/* Left side: This will now center its own content vertically */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mt-10">
            <input
              type="number"
              value={num1}
              readOnly
              className="w-24 text-2xl text-center border rounded px-2 py-1 bg-gray-100"
            />
            <span className="text-3xl font-bold">&times;</span>
            <input
              type="number"
              value={num2}
              readOnly
              className="w-24 text-2xl text-center border rounded px-2 py-1 bg-gray-100"
            />
          </div>
          {/* Display current set and question information */}
          <div className="flex justify-center items-center mt-8 my-2 text-lg">
            Level {currentSetIndex + 1} | Question: {currentQuestionIndex + 1} /
            10
          </div>
          {/*  Progress Box */}
          <div className="border border-gray-300 p-4 rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Current Level Progress
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {questionStatuses.map((isCorrect, index) => {
                return (
                  <div
                    key={index}
                    className={`rounded-full flex items-center justify-center text-white text-sm font-bold
                      ${isCorrect ? "bg-green-500" : "bg-red-400"}
                      ${
                        index === currentQuestionIndex
                          ? "border-2 border-blue-500 scale-110"
                          : ""
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side: Multiplication Steps and Next Button */}
        <div className="flex flex-col items-center">
          {!isNaN(Number(num1)) && !isNaN(Number(num2)) && (
            <MultiplicationSteps
              key={`${num1}-${num2}-${currentSetIndex}-${currentQuestionIndex}`}
              num1={Number(num1)}
              num2={Number(num2)}
              onAllCorrect={handleProblemCorrect}
              questionIndex={currentQuestionIndex}
            />
          )}
          <div
            className={`flex justify-center mb-6 ${
              !showNext ? "invisible" : ""
            }`}
          >
            <button
              onClick={handleNextProblem}
              className="px-6 py-2 bg-blue-800 text-white text-xl rounded"
            >
              Next Problem &#8594;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
