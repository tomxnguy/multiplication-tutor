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
  value,
}: InputSquareProps) {
  function handleOneNumber(event: React.ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;

    if (/^\d?$/.test(val)) {
      if (onValueChange) {
        onValueChange(val);
      }
    }
  }

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    event.target.setSelectionRange(0, event.target.value.length);
  }

  return (
    <input
      type="text"
      maxLength={1}
      className={`w-14 h-14 text-center border rounded ${
        isFlashing ? "bg-amber-400" : ""
      } text-3xl`}
      placeholder=""
      onClick={onClick}
      onChange={handleOneNumber}
      onFocus={handleFocus}
      value={value || ""}
      style={{
        appearance: "none",
        userSelect: "none",
        caretColor: "transparent",
        cursor: "pointer",
      }}
    />
  );
}
