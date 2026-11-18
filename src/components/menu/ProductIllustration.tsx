import type { ReactNode } from "react";
import type { Illustration } from "@/types/content";

const C = {
  white: "#fffdf9",
  rim: "#ece2d4",
  ring: "#f2ebe1",
  shadow: "rgb(38 26 21 / 0.10)",
  coffee: "#4a2a1c",
  crema: "#b5773f",
  milk: "#f6ead8",
  foam: "#e7cfa8",
  cocoa: "#5b2e1e",
  dough: "#dfa45c",
  doughLight: "#f2cb8a",
  doughDark: "#b8763a",
};

function Saucer({ r = 74, x = 160, y = 120 }: { r?: number; x?: number; y?: number }) {
  return (
    <>
      <circle cx={x + 5} cy={y + 8} r={r} fill={C.shadow} />
      <circle cx={x} cy={y} r={r} fill={C.white} stroke={C.rim} strokeWidth={2} />
      <circle cx={x} cy={y} r={r * 0.78} fill="none" stroke={C.ring} strokeWidth={2} />
    </>
  );
}

function Cup({ r, x = 160, y = 120, children }: { r: number; x?: number; y?: number; children: ReactNode }) {
  return (
    <>
      <rect x={x + r - 4} y={y - 8} width={r * 0.55} height={16} rx={8} fill={C.white} stroke={C.rim} strokeWidth={2.5} />
      <circle cx={x} cy={y} r={r} fill={C.white} stroke={C.rim} strokeWidth={2.5} />
      {children}
    </>
  );
}

function Spoon({ x = 108, y = 168 }: { x?: number; y?: number }) {
  return (
    <g transform={`rotate(-28 ${x} ${y})`}>
      <rect x={x - 26} y={y - 2.5} width={44} height={5} rx={2.5} fill="#d8cfc3" />
      <ellipse cx={x + 24} cy={y} rx={9} ry={6} fill="#d8cfc3" />
    </g>
  );
}

function Plate({ r = 92 }: { r?: number }) {
  return (
    <>
      <circle cx={165} cy={128} r={r} fill={C.shadow} />
      <circle cx={160} cy={120} r={r} fill={C.white} stroke={C.rim} strokeWidth={2} />
      <circle cx={160} cy={120} r={r * 0.74} fill="none" stroke={C.ring} strokeWidth={2} />
    </>
  );
}

function Ice({ x, y, a }: { x: number; y: number; a: number }) {
  return (
    <rect
      x={x - 11}
      y={y - 11}
      width={22}
      height={22}
      rx={5}
      fill="rgb(255 255 255 / 0.45)"
      stroke="rgb(255 255 255 / 0.7)"
      strokeWidth={1.5}
      transform={`rotate(${a} ${x} ${y})`}
    />
  );
}

function Glass({ fill, children }: { fill: string; children?: ReactNode }) {
  return (
    <>
      <circle cx={160} cy={120} r={74} fill="#d9b98f" />
      <circle cx={160} cy={120} r={66} fill="none" stroke="#c9a679" strokeWidth={2} strokeDasharray="2 5" />
      <circle cx={165} cy={127} r={56} fill={C.shadow} />
      <circle cx={160} cy={120} r={56} fill="#eef2f1" stroke="#dfe6e4" strokeWidth={3} />
      <circle cx={160} cy={120} r={49} fill={fill} />
      {children}
      <Ice x={142} y={104} a={14} />
      <Ice x={176} y={110} a={-20} />
      <Ice x={156} y={140} a={32} />
      <circle cx={186} cy={138} r={8} fill={C.white} stroke="#a46d4b" strokeWidth={4} />
    </>
  );
}

function Crema({ id, r, from = "#c88a4f", to = "#6b3a21" }: { id: string; r: number; from?: string; to?: string }) {
  return (
    <>
      <defs>
        <radialGradient id={id} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </radialGradient>
      </defs>
      <circle cx={160} cy={120} r={r} fill={`url(#${id})`} />
    </>
  );
}

function Bun({ x, y, r, id }: { x: number; y: number; r: number; id: string }) {
  return (
    <>
      <circle cx={x + 3} cy={y + 4} r={r} fill={C.shadow} />
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={2} fill={C.doughDark} opacity={0.6} />
      <circle cx={x + r * 0.35} cy={y + r * 0.15} r={1.6} fill={C.doughDark} opacity={0.5} />
      <circle cx={x + r * 0.05} cy={y + r * 0.45} r={1.4} fill={C.doughDark} opacity={0.5} />
    </>
  );
}

function drawing(kind: Illustration, uid: string): ReactNode {
  const g = `${uid}-g`;
  switch (kind) {
    case "espresso":
      return (
        <>
          <Saucer r={62} />
          <Spoon x={112} y={166} />
          <Cup r={36}>
            <Crema id={g} r={28} />
          </Cup>
        </>
      );
    case "espresso-duplo":
      return (
        <>
          <Saucer r={50} x={110} y={122} />
          <Saucer r={50} x={212} y={116} />
          <Cup r={29} x={110} y={122}>
            <circle cx={110} cy={122} r={22} fill="#7a4526" />
          </Cup>
          <Cup r={29} x={212} y={116}>
            <circle cx={212} cy={116} r={22} fill="#7a4526" />
          </Cup>
        </>
      );
    case "coado":
      return (
        <>
          <Saucer />
          <Spoon />
          <Cup r={48}>
            <circle cx={160} cy={120} r={39} fill="#3a2116" />
            <ellipse cx={148} cy={108} rx={14} ry={6} fill="rgb(255 255 255 / 0.12)" transform="rotate(-30 148 108)" />
          </Cup>
          <ellipse cx={232} cy={176} rx={7} ry={5} fill="#5a3322" transform="rotate(30 232 176)" />
          <ellipse cx={246} cy={168} rx={7} ry={5} fill="#4a2a1c" transform="rotate(-20 246 168)" />
        </>
      );
    case "cappuccino":
      return (
        <>
          <Saucer />
          <Spoon />
          <Cup r={52}>
            <Crema id={g} r={43} from="#c08a52" to="#7a4526" />
            <circle cx={160} cy={122} r={30} fill={C.milk} />
            <path d="M160 140c-14-9-24-17-24-27 0-7 5-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 7 0 12 5 12 12 0 10-10 18-24 27z" fill="#b5773f" />
            <path d="M160 133c-9-6-15-11-15-17 0-4 3-7 7-7 3 0 6 2 8 5 2-3 5-5 8-5 4 0 7 3 7 7 0 6-6 11-15 17z" fill={C.milk} />
          </Cup>
        </>
      );
    case "latte":
      return (
        <>
          <Saucer />
          <Spoon />
          <Cup r={52}>
            <Crema id={g} r={43} from="#d2a06c" to="#9a6038" />
            <g fill="none" stroke={C.milk} strokeWidth={5} strokeLinecap="round">
              <path d="M160 152v-58" />
              <path d="M142 140c6 6 30 6 36 0" />
              <path d="M140 128c8 7 32 7 40 0" />
              <path d="M142 116c7 6 29 6 36 0" />
              <path d="M146 104c6 5 22 5 28 0" />
            </g>
          </Cup>
        </>
      );
    case "mocha":
      return (
        <>
          <Saucer />
          <Spoon />
          <Cup r={52}>
            <Crema id={g} r={43} from="#8a5434" to="#4a2a1c" />
            <path d="M136 104q8 10 16 0t16 0 16 0M132 120q8 10 16 0t16 0 16 0 8 0M136 136q8 10 16 0t16 0 16 0" fill="none" stroke="#e9cfa9" strokeWidth={3} strokeLinecap="round" />
          </Cup>
        </>
      );
    case "gelado":
      return <Glass fill="#5a341f" />;
    case "latte-gelado":
      return (
        <Glass fill="#b98458">
          <path d="M126 118c10-18 30-18 40-4s28 12 34-2" fill="none" stroke={C.milk} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
        </Glass>
      );
    case "chocolate":
      return (
        <>
          <Saucer />
          <Cup r={52}>
            <circle cx={160} cy={120} r={43} fill={C.cocoa} />
            <circle cx={160} cy={120} r={24} fill={C.milk} />
            <circle cx={160} cy={120} r={15} fill="#fff8ee" />
            <circle cx={160} cy={120} r={6} fill={C.milk} />
            <circle cx={152} cy={112} r={1.6} fill={C.cocoa} />
            <circle cx={168} cy={116} r={1.6} fill={C.cocoa} />
            <circle cx={158} cy={130} r={1.6} fill={C.cocoa} />
          </Cup>
        </>
      );
    case "pao-de-queijo":
      return (
        <>
          <defs>
            <radialGradient id={g} cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor={C.doughLight} />
              <stop offset="100%" stopColor={C.dough} />
            </radialGradient>
          </defs>
          <Plate />
          <Bun x={132} y={104} r={27} id={g} />
          <Bun x={190} y={108} r={26} id={g} />
          <Bun x={160} y={152} r={27} id={g} />
        </>
      );
    case "croissant":
      return (
        <>
          <defs>
            <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.doughLight} />
              <stop offset="100%" stopColor={C.dough} />
            </linearGradient>
          </defs>
          <Plate />
          <g transform="rotate(-6 160 120)">
            <path
              d="M96 146C90 64 230 64 224 146C212 140 196 132 160 132C124 132 108 140 96 146Z"
              fill={C.shadow}
              transform="translate(4 7)"
            />
            <path
              d="M96 146C90 64 230 64 224 146C212 140 196 132 160 132C124 132 108 140 96 146Z"
              fill={`url(#${g})`}
              stroke={C.doughDark}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <g fill="none" stroke={C.doughDark} strokeWidth={2.2} strokeLinecap="round" opacity={0.75}>
              <path d="M116 96c5 10 7 22 4 40" />
              <path d="M137 85c3 12 5 28 2 47" />
              <path d="M160 81v51" />
              <path d="M183 85c-3 12-5 28-2 47" />
              <path d="M204 96c-5 10-7 22-4 40" />
            </g>
          </g>
        </>
      );
    case "bolo":
      return (
        <>
          <Plate />
          <path d="M108 160 L176 74 A96 96 0 0 1 214 138 Z" fill="rgb(38 26 21 / 0.1)" transform="translate(5 6)" />
          <path d="M108 160 L176 74 A96 96 0 0 1 214 138 Z" fill="#eac58c" />
          <path d="M112 152 L176 80 A90 90 0 0 1 208 136 Z" fill="#7a4630" />
          <path d="M176 80 A90 90 0 0 1 208 136" fill="none" stroke="#f3dcae" strokeWidth={4} />
          <circle cx={170} cy={110} r={3} fill="#f6e3c4" />
          <circle cx={186} cy={124} r={3} fill="#f6e3c4" />
          <circle cx={160} cy={130} r={3} fill="#f6e3c4" />
          <rect x={92} y={84} width={6} height={58} rx={3} fill="#d8cfc3" transform="rotate(-24 95 113)" />
        </>
      );
    case "brownie":
      return (
        <>
          <Plate />
          <g transform="rotate(-10 140 116)">
            <rect x={98} y={78} width={74} height={74} rx={8} fill={C.shadow} transform="translate(4 6)" />
            <rect x={98} y={78} width={74} height={74} rx={8} fill="#4a2b1f" />
            <path d="M108 96l14 6 10-8 14 10 12-6M106 122l16-4 12 10 16-6 14 6M114 140l12-6 14 6" fill="none" stroke="#6b4231" strokeWidth={2} strokeLinecap="round" />
          </g>
          <g transform="rotate(14 200 136)">
            <rect x={168} y={104} width={66} height={66} rx={8} fill={C.shadow} transform="translate(4 6)" />
            <rect x={168} y={104} width={66} height={66} rx={8} fill="#55322a" />
            <path d="M176 120l12 6 12-8 12 8 10-4M178 146l12-4 14 8 14-6" fill="none" stroke="#734a38" strokeWidth={2} strokeLinecap="round" />
          </g>
        </>
      );
    case "biscoitos":
      return (
        <>
          <defs>
            <radialGradient id={g} cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor={C.doughLight} />
              <stop offset="100%" stopColor="#cf9150" />
            </radialGradient>
          </defs>
          <Plate />
          {[
            [126, 100],
            [176, 92],
            [204, 132],
            [160, 136],
            [118, 146],
            [168, 170],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={(x as number) + 2} cy={(y as number) + 3} r={19} fill={C.shadow} />
              <circle cx={x} cy={y} r={19} fill={`url(#${g})`} />
              <path d={`M${(x as number) - 8} ${y}h16`} stroke={C.doughDark} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
            </g>
          ))}
        </>
      );
  }
}

export function ProductIllustration({ kind, uid, className }: { kind: Illustration; uid: string; className?: string }) {
  return (
    <svg viewBox="0 0 320 240" className={className} role="presentation" aria-hidden="true">
      {drawing(kind, uid)}
    </svg>
  );
}
