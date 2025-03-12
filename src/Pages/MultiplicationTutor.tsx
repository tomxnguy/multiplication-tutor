import { useState } from "react";
import Digit from "../Components/Digit";
import MultiplicationSteps from "../Components/MultiplicationSteps";

export default function MultiplicationTutor() {
  const [num1] = useState(() => Math.floor(Math.random() * 1000) + 1);
  const [num2] = useState(() => Math.floor(Math.random() * 100) + 10);

  return (
    <>
      <div className="w-full flex justify-center py-2 bg-indigo-200">
        <h2 className="text-xl">Long Multiplication</h2>
      </div>

      <div className="flex p-4 justify-center items-center">
        <Digit
          number={num1}
          className="text-4xl font-bold p-4 border rounded bg-white shadow "
        />
        <span className="flex px-3 text-3xl justify-center">&times;</span>
        <Digit
          number={num2}
          className="text-4xl font-bold p-4 border rounded bg-white shadow "
        />
      </div>

      <MultiplicationSteps num1={num1} num2={num2} />
    </>
  );
}
