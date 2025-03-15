import "../App.css";

export type InputSquareProps = {
  onClick: () => void;
  isFlashing: boolean;
  className?: string;
  value?: string;
};

export default function InputSquare({ onClick, isFlashing }: InputSquareProps) {
  function handleOneNumber(event: React.ChangeEvent<HTMLInputElement>) {
    const oneNumber = event.target.value;
    if (oneNumber.length > 1) {
      event.target.value = oneNumber.slice(0, 1);
    }
  }

  return (
    <input
      type="number"
      max="9"
      min="0"
      className={`w-14 h-14 text-center border rounded ${
        isFlashing ? "bg-amber-300" : ""
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
