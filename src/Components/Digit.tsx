export type DigitProps = {
  number: number;
  className?: string;
};

export default function Digit({ number, className = "" }: DigitProps) {
  return <div className={` ${className}`}>{number}</div>;
}
