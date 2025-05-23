import { useState } from "react";
import MultiplicationSteps from "../Components/MultiplicationSteps";

export default function MultiplicationTutor() {
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [showNext, setShowNext] = useState(false);

  function handleNextProblem() {
    setNum1((Math.floor(Math.random() * 1000) + 1).toString());
    setNum2((Math.floor(Math.random() * 1000) + 10).toString());
    setShowNext(false);
  }

  return (
    <>
      <div className="w-full flex justify-center py-2 bg-indigo-200">
        <h2 className="text-xl">Long Multiplication</h2>
      </div>

      <div className="flex justify-center items-center gap-4 my-4">
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          className="w-24 text-2xl text-center border rounded px-2 py-1"
        />

        <span className="text-3xl font-bold">&times;</span>
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          className="w-24 text-2xl text-center border rounded px-2 py-1"
        />
      </div>

      {!isNaN(Number(num1)) && !isNaN(Number(num2)) && (
        <MultiplicationSteps
          key={`${num1}-${num2}`}
          num1={Number(num1)}
          num2={Number(num2)}
          onAllCorrect={() => setShowNext(true)}
        />
      )}

      {showNext && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleNextProblem}
            className="px-6 py-2 bg-blue-800 text-white text-xl rounded"
          >
            Next Problem &#8594;
          </button>
        </div>
      )}
    </>
  );
}
