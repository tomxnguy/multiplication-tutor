import "../App.css";

export type InputSquareProps = {
  onClick: () => void;
  isFlashing: boolean;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export default function InputSquare({
  onClick,
  isFlashing,
  onValueChange,
}: InputSquareProps) {
  function handleOneNumber(event: React.ChangeEvent<HTMLInputElement>) {
    const oneNumber = event.target.value;
    if (oneNumber.length > 1) {
      event.target.value = oneNumber.slice(0, 1);
    }

    if (onValueChange) {
      onValueChange(event.target.value);
    }
  }

  return (
    <input
      type="number"
      max="9"
      min="0"
      className={`w-14 h-14 text-center border rounded ${
        isFlashing ? "bg-amber-400" : ""
      } text-3xl`}
      placeholder=""
      onClick={onClick}
      onChange={handleOneNumber}
      style={{
        appearance: "none",
        userSelect: "none",
        caretColor: "transparent",
        cursor: "pointer",
      }}
    />
  );
}
