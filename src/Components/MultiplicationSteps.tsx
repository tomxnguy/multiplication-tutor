import { useEffect, useState, useRef } from "react";
import { ProductInputHandle } from "./ProductInput";
import ProductInput from "./ProductInput";
import InputSquare from "./InputSquare";

export type MultiplicationStepsProps = {
  num1: number;
  num2: number;
  onAllCorrect: (questionIndex: number) => void;
  questionIndex: number;
};

export default function MultiplicationSteps({
  num1,
  num2,
  onAllCorrect,
  questionIndex,
}: MultiplicationStepsProps) {
  const [checkCorrect, setCheckCorrect] = useState(false);
  const [partialsCorrect, setPartialsCorrect] = useState<
    Record<string, boolean>
  >({});
  const [productCorrect, setProductCorrect] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFlashingCarry, setIsFlashingCarry] = useState<number | null>(null);
  const inputRefs = useRef<Record<string, ProductInputHandle | null>>({});
  const productInputRef = useRef<ProductInputHandle | null>(null);

  const [carryValues, setCarryValues] = useState<string[]>(() =>
    Array(num1.toString().length - 1).fill("")
  );
  const [focusedPartial, setFocusedPartial] = useState<string | null>(null);

  const num2Digits = num2.toString().split("").map(Number);

  const shouldShowPartialProductLines = num2Digits.length > 1;

  const isNum1MultiDigit = num1.toString().length > 1;

  const partialProducts = num2Digits.map((digit, i, arr) => {
    const position = arr.length - 1 - i;
    const result = (num1 * digit).toString() + "0".repeat(position);
    return {
      label: `partial-${position}`,
      correctAnswer: result,
    };
  });

  const prevIsCorrectRef = useRef(false);
  useEffect(() => {
    prevIsCorrectRef.current = isCorrect;
  });

  useEffect(() => {
    let currentCalculatedCorrectness;

    if (shouldShowPartialProductLines) {
      const allPartialCorrect =
        partialProducts.length > 0 &&
        partialProducts.every(({ label }) => partialsCorrect[label]);
      currentCalculatedCorrectness = allPartialCorrect && productCorrect;
    } else {
      currentCalculatedCorrectness = productCorrect;
    }

    if (currentCalculatedCorrectness && !prevIsCorrectRef.current) {
      onAllCorrect(questionIndex);
    }

    setIsCorrect(currentCalculatedCorrectness);
  }, [
    partialsCorrect,
    productCorrect,
    onAllCorrect,
    questionIndex,
    shouldShowPartialProductLines,
  ]);

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
      setTimeout(() => setIsFlashingCarry(null), 5000);
    }
  }

  function focusNextEmptyInput() {
    if (shouldShowPartialProductLines) {
      for (const label of Object.keys(inputRefs.current)) {
        const el = inputRefs.current[label];
        if (el) {
          el.focusRightMostEmpty();
          const activeEl = document.activeElement as HTMLInputElement;
          if (activeEl?.value === "") return;
        }
      }
    }
    if (productInputRef.current) {
      productInputRef.current.focusRightMostEmpty();
    }
  }

  useEffect(() => {
    if (focusedPartial && inputRefs.current[focusedPartial]) {
      inputRefs.current[focusedPartial]?.focusRightMostEmpty();
    } else if (focusedPartial === "product" && productInputRef.current) {
      productInputRef.current.focusRightMostEmpty();
    }
  }, [focusedPartial]);

  useEffect(() => {
    if (focusedPartial !== null && isNum1MultiDigit) {
      setCarryValues(Array(num1.toString().length - 1).fill(""));
    }
  }, [focusedPartial, num1, isNum1MultiDigit]);

  return (
    <div className="flex flex-col items-center">
      <div className="mt-10 text-8xl font-mono">
        <div className="flex flex-col items-end">
          {isNum1MultiDigit && (
            <div className="flex space-x-2 mb-2 pr-13">
              {carryValues.map((value, index) => (
                <InputSquare
                  key={index}
                  value={value}
                  onClick={() => handleInputClick(index, "carry")}
                  isFlashing={isFlashingCarry === index}
                  onValueChange={(val) => {
                    const next = [...carryValues];
                    next[index] = val;
                    setCarryValues(next);

                    if (val.trim() !== "") {
                      focusNextEmptyInput();
                    }
                  }}
                />
              ))}
            </div>
          )}
          <div>{num1}</div>
          <div className="flex border-b-8 justify-between">
            <div className="pr-12">&times;</div>
            <div>{num2}</div>
          </div>
        </div>

        {shouldShowPartialProductLines &&
          partialProducts
            .slice()
            .reverse()
            .map(({ label, correctAnswer }, i) => {
              const digitIndex = partialProducts.length - 1 - i;
              const digit = num2.toString().split("")[digitIndex];
              const alignLeft = digit === "1";

              return (
                <div
                  key={label}
                  className={`flex space-x-2 justify-end mt-4 ${
                    i === partialProducts.length - 1 ? "border-b-8 pb-4" : ""
                  }`}
                >
                  <ProductInput
                    ref={(el) => {
                      inputRefs.current[label] = el;
                    }}
                    length={correctAnswer.length}
                    label={label}
                    correctAnswer={correctAnswer}
                    checkCorrect={checkCorrect}
                    onCheckCorrect={(isCorrect) =>
                      handleCorrectState(label, isCorrect)
                    }
                    justify={alignLeft ? "start" : "end"}
                    onFocus={() => setFocusedPartial(label)}
                    onFinishRow={() => {
                      const labels = Object.keys(inputRefs.current);
                      const currentIndex = labels.indexOf(label);
                      const nextLabel = labels[currentIndex + 1];

                      if (nextLabel) {
                        setFocusedPartial(nextLabel);
                      } else {
                        setFocusedPartial("product");
                      }
                    }}
                  />
                </div>
              );
            })}
        {/* Product */}
        <div className="flex justify-end space-x-2 mt-4">
          <ProductInput
            ref={(el) => {
              productInputRef.current = el;
            }}
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
