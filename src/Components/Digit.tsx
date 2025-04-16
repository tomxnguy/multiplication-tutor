export type DigitProps = {
  number: number;
  className?: string;
};

export default function Digit({ number, className = "" }: DigitProps) {
  return (
    <span className={` ${className}`} aria-label={`digit-${number}`}>
      {number}
    </span>
  );
}
