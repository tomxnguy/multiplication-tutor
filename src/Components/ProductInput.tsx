import { useState, useEffect } from "react";

export type ProductInputProps = {
  length: number;
  label: string;
  correctAnswer: string;
  checkCorrect: boolean;
};

export default function ProductInput({
  length,
  label,
  correctAnswer,
  checkCorrect,
}: ProductInputProps) {
  const [value, setValue] = useState<string[]>(Array(length).fill(""));
  const [isCorrect, setIsCorrect] = useState<boolean[] | null>(null);

  function handleInputProduct(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 1) return;
    const newValue = [...value];
    newValue[index] = input;

    if (input && index > 0) {
      document.getElementById(`${label}-input-${index - 1}`)?.focus();
    }

    setValue(newValue);
  }

  useEffect(() => {
    if (checkCorrect) {
      const newIsCorrect = value.map(
        (input, idx) => input === correctAnswer[idx]
      );
      setIsCorrect(newIsCorrect);
    }
  }, [checkCorrect, value, correctAnswer]);

  return (
    <div className="flex justify-end space-x-2">
      {value.map((digit, index) => (
        <input
          key={index}
          id={`${label}-input-${index}`}
          type="text"
          value={digit}
          onChange={(e) => handleInputProduct(e, index)}
          maxLength={1}
          onFocus={(e) => e.target.setSelectionRange(1, 1)}
          onMouseUp={(e) => {
            e.preventDefault();
            e.currentTarget.setSelectionRange(1, 1);
          }}
          className={`border-4 text-4xl text-center w-14 h-14 ${
            isCorrect === null
              ? "border-black"
              : isCorrect[index]
              ? "border-green-500"
              : "border-red-500"
          }`}
        />
      ))}
    </div>
  );
}
