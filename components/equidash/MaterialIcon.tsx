type Props = {
  name: string;
  className?: string;
};

export function MaterialIcon({ name, className = "" }: Props) {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} aria-hidden>
      {name}
    </span>
  );
}
