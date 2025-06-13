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
  onFocus?: () => void;
  onFinishRow?: () => void;
  className?: string;
};

export type ProductInputHandle = {
  focusRightMostEmpty: () => void;
  isFilled: () => boolean;
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
      className,
    },
    ref
  ) {
    const [value, setValue] = useState<string[]>(Array(length).fill(""));
    const [isCorrect, setIsCorrect] = useState<boolean[] | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const justTyped = useRef(false);
    const hasEnteredRow = useRef(false);

    const checkedResults = useRef<boolean[] | null>(null);

    const [direction, setDirection] = useState<"ltr" | "rtl">(
      justify === "start" ? "ltr" : "rtl"
    );

    useEffect(() => {
      hasEnteredRow.current = false;
      setValue(Array(length).fill(""));
      setIsCorrect(null);
      setFocusedIndex(null);
      setDirection(justify === "start" ? "ltr" : "rtl");
      checkedResults.current = null;
    }, [label, length, justify]);

    function handleInputProduct(
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) {
      const raw = e.target.value;
      const input = raw.replace(/\D/g, "").slice(-1);
      const newValue = [...value];
      newValue[index] = input;
      setValue(newValue);

      if (isCorrect !== null || checkedResults.current !== null) {
        setIsCorrect(null);
        checkedResults.current = null;
      }

      justTyped.current = true;

      const shouldSnap =
        input.length === 1 &&
        document.activeElement === inputRefs.current[index];

      if (shouldSnap) {
        let nextIndex;
        if (direction === "ltr") {
          nextIndex = index + 1;
        } else {
          nextIndex = index - 1;
        }

        if (input !== "") {
          if (nextIndex >= 0 && nextIndex < length) {
            inputRefs.current[nextIndex]?.focus();
          } else if (onFinishRow && newValue.every((v) => v !== "")) {
            onFinishRow();
          }
        }
      }
    }

    function handleSnapToPosition(targetIndex: number) {
      if (justTyped.current) {
        justTyped.current = false;
        return;
      }
      inputRefs.current[targetIndex]?.focus();
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
          inputRefs.current[length - 1]?.focus();
        } else {
          for (let i = value.length - 1; i >= 0; i--) {
            if (!value[i]) {
              inputRefs.current[i]?.focus();
              return;
            }
          }
          inputRefs.current[0]?.focus();
        }
        setDirection(justify === "start" ? "ltr" : "rtl");
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
        checkedResults.current = newIsCorrect;
        setIsCorrect(newIsCorrect);
        if (onCheckCorrect) {
          onCheckCorrect(newIsCorrect.every(Boolean));
        }
      } else {
        if (isCorrect === null) {
          checkedResults.current = null;
        }
      }
    }, [checkCorrect, value, correctAnswer, onCheckCorrect]);

    useEffect(() => {
      if (
        value.every((v) => v !== "") &&
        onFinishRow &&
        !hasEnteredRow.current
      ) {
        onFinishRow();
        hasEnteredRow.current = true;
      }
    }, [value, onFinishRow]);

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();

        setValue((prev) => {
          const newValues = [...prev];
          if (newValues[index] !== "") {
            newValues[index] = "";
          } else if (index > 0) {
            inputRefs.current[index - 1]?.focus();
            newValues[index - 1] = "";
          }
          return newValues;
        });
        if (value[index] === "" && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }

        if (isCorrect !== null || checkedResults.current !== null) {
          setIsCorrect(null);
          checkedResults.current = null;
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          setDirection("rtl");
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
          setDirection("ltr");
        }
      } else if (!/^\d$/.test(e.key) && e.key !== "Tab") {
        e.preventDefault();
      }
    };

    return (
      <div
        className={`flex space-x-2 ${
          justify === "start" ? "justify-start" : "justify-end"
        } ${className || ""}`}
      >
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
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={(e) => {
              const target = e.target as HTMLInputElement;
              target.setSelectionRange(0, target.value.length);

              if (index === 0) {
                setDirection("ltr");
              } else if (index === value.length - 1) {
                setDirection("rtl");
              }
              handleSnapToPosition(index);
              setFocusedIndex(index);
            }}
            onFocus={(e) => {
              const target = e.target as HTMLInputElement;
              target.setSelectionRange(0, target.value.length);

              if (index === 0) {
                setDirection("ltr");
              } else if (index === value.length - 1) {
                setDirection("rtl");
              }
              handleSnapToPosition(index);
              setFocusedIndex(index);
            }}
            onBlur={() => setFocusedIndex(null)}
            className={`border-4 text-4xl text-center w-14 h-14 transition-all duration-200
              ${
                isCorrect === null
                  ? "border-black"
                  : isCorrect[index]
                  ? "border-green-500"
                  : "border-red-500"
              }
              ${focusedIndex === index ? "bg-yellow-300" : ""}
              ${focusedIndex === index ? "no-caret" : ""}
            `}
          />
        ))}
      </div>
    );
  }
);

export default ProductInput;
