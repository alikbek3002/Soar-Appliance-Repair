const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function Gear({
  size = 40,
  toothColor,
  voidColor,
}: {
  size?: number;
  toothColor: string;
  voidColor: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      className="soar-gear"
      aria-label="Soar logo"
    >
      <g fill={toothColor}>
        {ANGLES.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <rect x="-7" y="-49" width="14" height="22" rx="2.5" />
          </g>
        ))}
      </g>
      <circle r="33" fill={toothColor} />
      <circle r="14" fill={voidColor} />
      <circle r="6" fill={toothColor} />
    </svg>
  );
}
