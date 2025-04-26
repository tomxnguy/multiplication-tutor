import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

export type ProductInputProps = {
  length: number;
  label: string;
  correctAnswer: string;
  checkCorrect: boolean;
  onCheckCorrect?: (isCorrect: boolean) => void;
  justify?: "start" | "end";
  onClick?: () => void; // <-- add this
};

export type ProductInputHandle = {
  focusRightMostEmpty: () => void;
};

const ProductInput = forwardRef<ProductInputHandle, ProductInputProps>(
  function ProductInput(
    { length, label, correctAnswer, checkCorrect, onCheckCorrect, justify },
    ref
  ) {
    const [value, setValue] = useState<string[]>(Array(length).fill(""));
    const [isCorrect, setIsCorrect] = useState<boolean[] | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    function handleInputProduct(
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) {
      let input = e.target.value.replace(/\D/g, "");
      if (input.length > 1) return;
      const newValue = [...value];
      newValue[index] = input;

      setValue(newValue);

      if (input) {
        const nextIndex = justify === "start" ? index + 1 : index - 1;
        const nextEl = document.getElementById(`${label}-input-${nextIndex}`);
        if (nextEl) nextEl.focus();
      }
    }

    function handleSnapToPosition() {
      if (justify === "start") {
        for (let i = 0; i < value.length; i++) {
          if (!value[i]) {
            inputRefs.current[i]?.focus();
            break;
          }
        }
      } else {
        for (let i = value.length - 1; i >= 0; i--) {
          if (!value[i]) {
            inputRefs.current[i]?.focus();
            break;
          }
        }
      }
    }

    // 🔥 EXPOSE METHOD TO PARENT
    useImperativeHandle(ref, () => ({
      focusRightMostEmpty() {
        if (justify === "start") {
          // left-to-right
          for (let i = 0; i < value.length; i++) {
            if (!value[i]) {
              inputRefs.current[i]?.focus();
              return;
            }
          }
        } else {
          // right-to-left
          for (let i = value.length - 1; i >= 0; i--) {
            if (!value[i]) {
              inputRefs.current[i]?.focus();
              return;
            }
          }
        }
      },
    }));

    useEffect(() => {
      if (checkCorrect) {
        const newIsCorrect = value.map(
          (input, idx) => input === correctAnswer[idx]
        );
        setIsCorrect(newIsCorrect);

        if (onCheckCorrect) {
          onCheckCorrect(newIsCorrect.every(Boolean));
        }
      }
    }, [checkCorrect]);

    return (
      <div className={`flex space-x-2 justify-${justify ?? "end"}`}>
        {value.map((digit, index) => (
          <input
            key={index}
            id={`${label}-input-${index}`}
            type="text"
            value={digit}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            maxLength={1}
            onChange={(e) => handleInputProduct(e, index)}
            onClick={handleSnapToPosition}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
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
            } ${focusedIndex === index ? "bg-yellow-300" : ""}`}
          />
        ))}
      </div>
    );
  }
);

export default ProductInput;
