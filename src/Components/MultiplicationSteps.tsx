import { useEffect, useState } from "react";
import InputSquare from "./InputSquare";
import ProductInput from "./ProductInput";

export type MultiplicationStepsProps = {
  num1: number;
  num2: number;
  onAllCorrect: () => void;
};

export default function MultiplicationSteps({
  num1,
  num2,
  onAllCorrect,
}: MultiplicationStepsProps) {
  const [isFlashingCarry, setIsFlashingCarry] = useState<number | null>(null);
  const [checkCorrect, setCheckCorrect] = useState(false);
  const [onesCorrect, setOnesCorrect] = useState(false);
  const [tensCorrect, setTensCorrect] = useState(false);
  const [productCorrect, setProductCorrect] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const allCorrect = onesCorrect && tensCorrect && productCorrect;
    setIsCorrect(allCorrect);

    if (allCorrect) {
      onAllCorrect();
    }
  }, [onesCorrect, tensCorrect, productCorrect, onAllCorrect]);

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
    setCheckCorrect(false);
    setTimeout(() => setCheckCorrect(true), 0);
  }

  function handleCorrectState(label: string, isCorrect: boolean) {
    if (label === "ones") setOnesCorrect(isCorrect);
    if (label === "tens") setTensCorrect(isCorrect);
    if (label === "product") setProductCorrect(isCorrect);

    const allCorrect = onesCorrect && tensCorrect && productCorrect;
    setIsCorrect(allCorrect);

    if (isCorrect && onesCorrect && tensCorrect && productCorrect) {
      onAllCorrect();
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mt-10 text-8xl font-mono">
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
            onCheckCorrect={(isCorrect) =>
              handleCorrectState("ones", isCorrect)
            }
          />
        </div>

        {/* Tens Multiplication */}
        <div className="flex space-x-2 border-b-8 pb-4 justify-end mt-4">
          <ProductInput
            length={tensResultsDigits.length}
            label="tens"
            correctAnswer={tensResultsDigits.join("")}
            checkCorrect={checkCorrect}
            onCheckCorrect={(isCorrect) =>
              handleCorrectState("tens", isCorrect)
            }
          />
        </div>

        {/* Product */}
        <div className="flex justify-end space-x-2 mt-4">
          <ProductInput
            length={productDigits.length}
            label="product"
            correctAnswer={productDigits.join("")}
            checkCorrect={checkCorrect}
            onCheckCorrect={(isCorrect) =>
              handleCorrectState("product", isCorrect)
            }
          />
        </div>

        {/* Submit & Next Button */}
        <div className="flex h-full mb-6 justify-center">
          {!isCorrect ? (
            <button
              onClick={handleSubmit}
              className="mt-4 px-4 py-1 bg-green-300 text-white text-3xl rounded"
            >
              Submit
            </button>
          ) : (
            <div className="flex flex-col items-center mt-6">
              <p className="text-green-500 text-3xl font-bold">Correct!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
