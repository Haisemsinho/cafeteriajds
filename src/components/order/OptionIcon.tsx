import type { ReactNode } from "react";
import type { GroupId } from "@/lib/order/pricing";

const cupBody = (top: number) => (
  <>
    <path d={`M10 ${top}h12l-1.6 ${27 - top}h-8.8z`} />
    <path d={`M9 ${top}h14`} strokeWidth={2.2} />
  </>
);

const bean = (x: number, filled: boolean) => (
  <g key={x} transform={`translate(${x} 0)`}>
    <ellipse cx="4" cy="16" rx="3.4" ry="5" fill={filled ? "currentColor" : "none"} />
    <path d="M4 11.2c-1.6 2.6 1.6 7 0 9.6" stroke={filled ? "var(--icon-cut, #fff)" : "currentColor"} />
  </g>
);

const shot = (x: number) => (
  <path key={x} d={`M${x} 9.5c2.3 3 3.6 5.2 3.6 7a3.6 3.6 0 01-7.2 0c0-1.8 1.3-4 3.6-7z`} fill="currentColor" />
);

const carton = (variant: "full" | "light" | "free") => (
  <>
    <path
      d="M10 10.5l2-3.5h8l2 3.5v15.5a1 1 0 01-1 1H11a1 1 0 01-1-1z"
      fill={variant === "full" ? "currentColor" : "none"}
      fillOpacity={0.18}
    />
    <path d="M10 10.5h12M12 7V5h8v2" />
    {variant === "free" ? <path d="M12.5 22.5l7-8" /> : null}
    {variant === "light" ? <path d="M13 19h6" strokeDasharray="1.5 2" /> : null}
  </>
);

const dots = (n: number) =>
  [0, 1, 2].map((i) => (
    <rect key={i} x={6 + i * 7.5} y={13} width="5" height="5" rx="1" fill={i < n ? "currentColor" : "none"} />
  ));

const icons: Partial<Record<GroupId, Record<string, ReactNode>>> = {
  tamanho: { p: cupBody(14), m: cupBody(10), g: cupBody(5) },
  temperatura: {
    quente: (
      <>
        <path d="M7 14h14v5a6 6 0 01-6 6h-2a6 6 0 01-6-6z" />
        <path d="M21 15.5h1.5a2.5 2.5 0 010 5H21" />
        <path d="M11 5c-1 1.3 1 2.4 0 4M15 5c-1 1.3 1 2.4 0 4" />
      </>
    ),
    gelado: (
      <>
        <path d="M8.5 6h15l-1.8 19.2a1.6 1.6 0 01-1.6 1.4h-8.2a1.6 1.6 0 01-1.6-1.4z" />
        <rect x="11.5" y="12" width="4" height="4" rx="0.8" transform="rotate(-12 13.5 14)" />
        <rect x="16" y="15.5" width="4" height="4" rx="0.8" transform="rotate(10 18 17.5)" />
        <path d="M9.4 10h13.2" />
      </>
    ),
  },
  intensidade: {
    suave: [bean(3, true), bean(12, false), bean(21, false)],
    tradicional: [bean(3, true), bean(12, true), bean(21, false)],
    intenso: [bean(3, true), bean(12, true), bean(21, true)],
  },
  dose: { simples: [shot(14)], dupla: [shot(9.5), shot(18.5)], extra: [shot(5.5), shot(14), shot(22.5)] },
  leite: {
    integral: carton("full"),
    desnatado: carton("light"),
    "sem-lactose": carton("free"),
    vegetal: <path d="M8 25c0-10 6-16 17-17-1 11-7 17-17 17zM8 25l9-9" />,
  },
  adocar: {
    sem: (
      <>
        <circle cx="16" cy="16" r="8.5" />
        <path d="M10 22l12-12" />
      </>
    ),
    acucar: (
      <>
        <path d="M9 12.5l7-3.5 7 3.5v8l-7 3.5-7-3.5z" />
        <path d="M9 12.5l7 3.5 7-3.5M16 16v8" />
      </>
    ),
    adocante: <path d="M16 6c4.5 5.6 7 9.6 7 12.6a7 7 0 01-14 0c0-3 2.5-7 7-12.6z" />,
  },
  docura: { pouco: dots(1), normal: dots(2), bastante: dots(3) },
};

export function hasOptionIcon(group: GroupId, choice: string) {
  return Boolean(icons[group]?.[choice]);
}

export function OptionIcon({ group, choice, size = 32 }: { group: GroupId; choice: string; size?: number }) {
  const content = icons[group]?.[choice];
  if (!content) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {content}
    </svg>
  );
}
