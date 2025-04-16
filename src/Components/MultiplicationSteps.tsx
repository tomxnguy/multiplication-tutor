import { useEffect, useState } from "react";
import ProductInput from "./ProductInput";
import InputSquare from "./InputSquare";

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
  const [checkCorrect, setCheckCorrect] = useState(false);
  const [partialsCorrect, setPartialsCorrect] = useState<
    Record<string, boolean>
  >({});

  const [productCorrect, setProductCorrect] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFlashingCarry, setIsFlashingCarry] = useState<number | null>(null);

  const num2Digits = num2.toString().split("").map(Number);

  const partialProducts = num2Digits.map((digit, i, arr) => {
    const position = arr.length - 1 - i;
    const result = (num1 * digit).toString() + "0".repeat(position);
    return {
      label: `partial-${position}`,
      correctAnswer: result,
    };
  });

  useEffect(() => {
    const allPartialCorrect =
      partialProducts.length > 0 &&
      partialProducts.every(({ label }) => partialsCorrect[label]);

    const allCorrect = allPartialCorrect && productCorrect;
    setIsCorrect(allCorrect);

    if (allCorrect) {
      onAllCorrect();
    }
  }, [partialsCorrect, productCorrect, partialProducts, onAllCorrect]);

  const product = num1 * num2;
  const productDigits = product.toString().split("");

  function handleSubmit() {
    setCheckCorrect(false);
    setTimeout(() => setCheckCorrect(true), 0);
  }

  function handleCorrectState(label: string, correct: boolean) {
    if (label === "product") {
      setProductCorrect(correct);
    } else {
      setPartialsCorrect((prev) => ({
        ...prev,
        [label]: correct,
      }));
    }
  }

  function handleInputClick(index: number, row: "carry") {
    if (row === "carry") {
      setIsFlashingCarry(index);
      setTimeout(() => setIsFlashingCarry(null), 500);
    }
  }

  const num1Digits = num1.toString().split("");

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

        {partialProducts.reverse().map(({ label, correctAnswer }, i) => (
          <div
            key={label}
            className={`flex space-x-2 justify-end mt-4 ${
              i === partialProducts.length - 1 ? "border-b-8 pb-4" : ""
            }`}
          >
            <ProductInput
              length={correctAnswer.length}
              label={label}
              correctAnswer={correctAnswer}
              checkCorrect={checkCorrect}
              onCheckCorrect={(isCorrect) =>
                handleCorrectState(label, isCorrect)
              }
            />
          </div>
        ))}
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
