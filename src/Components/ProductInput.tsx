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
  onFinishRow?: () => void;
};

export type ProductInputHandle = {
  focusRightMostEmpty: () => void;
};

const ProductInput = forwardRef<ProductInputHandle, ProductInputProps>(
  function ProductInput(
    {
      length,
      label,
      correctAnswer,
      checkCorrect,
      onCheckCorrect,
      justify,
      onFinishRow,
    },
    ref
  ) {
    const [value, setValue] = useState<string[]>(Array(length).fill(""));
    const [isCorrect, setIsCorrect] = useState<boolean[] | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const justTyped = useRef(false);
    const hasEnteredRow = useRef(false);
    const [direction, setDirection] = useState<"ltr" | "rtl">("rtl");

    useEffect(() => {
      hasEnteredRow.current = false;
    }, [label]);

    function handleInputProduct(
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) {
      const raw = e.target.value;
      const input = raw.replace(/\D/g, "").slice(-1);
      const newValue = [...value];
      const wasEmpty = newValue[index] === "";
      newValue[index] = input;
      setValue(newValue);

      justTyped.current = true;

      const shouldSnap =
        wasEmpty &&
        input.length === 1 &&
        document.activeElement === inputRefs.current[index];

      if (shouldSnap) {
        const nextIndex = direction === "ltr" ? index + 1 : index - 1;
        if (nextIndex >= 0 && nextIndex < length) {
          inputRefs.current[nextIndex]?.focus();
        } else if (onFinishRow) {
          onFinishRow();
        }
      }
    }

    function handleSnapToPosition() {
      if (justTyped.current) {
        justTyped.current = false;
        return;
      }

      if (direction === "ltr") {
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

    useImperativeHandle(ref, () => ({
      focusRightMostEmpty() {
        if (justify === "start") {
          for (let i = 0; i < value.length; i++) {
            if (!value[i]) {
              inputRefs.current[i]?.focus();
              return;
            }
          }
        } else {
          for (let i = value.length - 1; i >= 0; i--) {
            if (!value[i]) {
              inputRefs.current[i]?.focus();
              return;
            }
          }
        }
      },
      isFilled() {
        return value.every((v) => v !== "");
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

    useEffect(() => {
      if (value.every((v) => v !== "") && onFinishRow) {
        onFinishRow();
      }
    }, [value, onFinishRow]);

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
            onClick={(e) => {
              if (!hasEnteredRow.current) {
                const target = e.target as HTMLInputElement;
                target.setSelectionRange(0, target.value.length);
                hasEnteredRow.current = true;
              }

              // Set direction based on click index
              if (index === 0) {
                setDirection("ltr");
              } else if (index === value.length - 1) {
                setDirection("rtl");
              }

              handleSnapToPosition();
              setFocusedIndex(index);
            }}
            onFocus={(e) => {
              if (!hasEnteredRow.current) {
                const target = e.target as HTMLInputElement;
                target.setSelectionRange(0, target.value.length);
                hasEnteredRow.current = true;
              }

              // Set direction based on which box is focused
              if (index === 0) {
                setDirection("ltr");
              } else if (index === value.length - 1) {
                setDirection("rtl");
              }

              setFocusedIndex(index);
            }}
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
