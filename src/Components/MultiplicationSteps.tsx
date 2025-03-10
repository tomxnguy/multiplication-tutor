import { useState } from "react";
import InputSquare from "./InputSquare";
import ProductInput from "./ProductInput";

export type MultiplicationStepsProps = {
  num1: number;
  num2: number;
};

export default function MultiplicationSteps({
  num1,
  num2,
}: MultiplicationStepsProps) {
  const [isFlashingCarry, setIsFlashingCarry] = useState<number | null>(null);
  const [checkCorrect, setCheckCorrect] = useState(false);

  function handleInputClick(index: number, row: "carry") {
    if (row === "carry") {
      setIsFlashingCarry(index);
      setTimeout(() => setIsFlashingCarry(null), 500);
    }
  }

  const num1Digits = num1.toString().split("");
  const onesDigit = num2 % 10;
  const onesResult = num1 * onesDigit;
  const onesResultsDigits = onesResult.toString().split("");

  const tensDigit = Math.floor(num2 / 10);
  const tensResult = num1 * tensDigit;
  const tensResultsDigits = tensResult.toString().split("");
  tensResultsDigits.push("0");

  const product = num1 * num2;
  const productDigits = product.toString().split("");

  function handleSubmit() {
    setCheckCorrect(true);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mt-20 text-8xl font-mono">
        {/* InputSquares to help the user keep count of the carried numbers */}
        <div className="flex flex-col items-end">
          <div className="flex space-x-2 mb-2">
            {num1Digits.map((_, index) => (
              <InputSquare
                key={index}
                onClick={() => handleInputClick(index, "carry")}
                isFlashing={isFlashingCarry === index}
              />
            ))}
          </div>

          <div>{num1}</div>
          <div className="flex border-b-8 justify-between">
            <div className="pr-12">&times;</div>
            <div>{num2}</div>
          </div>
        </div>

        {/* Ones Multiplication */}
        <div className="flex justify-end space-x-2 mt-4">
          <ProductInput
            length={onesResultsDigits.length}
            label="ones"
            correctAnswer={onesResultsDigits.join("")}
            checkCorrect={checkCorrect}
          />
        </div>

        {/* Tens Multiplication */}
        <div className="flex space-x-2 border-b-8 pb-4 justify-end mt-4">
          <ProductInput
            length={tensResultsDigits.length}
            label="tens"
            correctAnswer={tensResultsDigits.join("")}
            checkCorrect={checkCorrect}
          />
        </div>

        {/* Product */}
        <div className="flex justify-end space-x-2 mt-4">
          <ProductInput
            length={productDigits.length}
            label="product"
            correctAnswer={productDigits.join("")}
            checkCorrect={checkCorrect}
          />
        </div>

        {/* Submit Button */}
        <div className="flex h-full mb-6 justify-center">
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-1 bg-green-300 text-whit text-3xl rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
