import type { SVGProps } from "react";

const paths = {
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17L17 7M9 7h8v8" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  phone: (
    <path d="M6.6 3.8l2.6.4 1.3 3.6-1.8 1.4a12 12 0 006 6l1.4-1.8 3.6 1.3.4 2.6c-.1 1.4-1.3 2.5-2.7 2.4C10.3 19.2 4.8 13.7 4.3 6.5c-.1-1.4 1-2.6 2.3-2.7z" />
  ),
  chat: (
    <>
      <path d="M4.5 19.5l1.2-3.6A7.8 7.8 0 1119.8 12a7.8 7.8 0 01-11.6 6.8z" />
      <path d="M9 10.5c.3 1.8 2.3 3.8 4.5 4.2" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  heart: <path d="M12 19.5s-7.5-4.4-7.5-10A4.3 4.3 0 0112 7a4.3 4.3 0 017.5 2.5c0 5.6-7.5 10-7.5 10z" />,
  cup: (
    <>
      <path d="M5 9.5h11v4.5a5 5 0 01-5 5h-1a5 5 0 01-5-5z" />
      <path d="M16 11h1.5a2.3 2.3 0 010 4.6H16" />
      <path d="M9 3.5c-.7 1 .7 1.8 0 3M12.5 3.5c-.7 1 .7 1.8 0 3" />
    </>
  ),
  iced: (
    <>
      <path d="M6.5 6h11l-1.4 13.2a1.5 1.5 0 01-1.5 1.3H9.4a1.5 1.5 0 01-1.5-1.3z" />
      <path d="M7 10.5h10M10 13.5l1.5 1.5M13.5 12.5l1 1.2" />
    </>
  ),
  plate: (
    <>
      <ellipse cx="12" cy="15.5" rx="8.5" ry="3" />
      <path d="M7.5 14c.5-3.3 2.3-5.5 4.5-5.5s4 2.2 4.5 5.5" />
      <path d="M12 6.5v2" />
    </>
  ),
  leaf: <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  sparkle: <path d="M12 4l1.6 4.8L18.5 10l-4.9 1.4L12 16l-1.6-4.6L5.5 10l4.9-1.2z" />,
  external: (
    <path d="M14 4h6v6M20 4l-8 8M18 14v4.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 014 18.5v-11A1.5 1.5 0 015.5 6H10" />
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2a1.5 1.5 0 001.5 1.3h6.2a1.5 1.5 0 001.5-1.3L17.5 7" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  edit: <path d="M14.5 5.5l4 4L9 19H5v-4zM12.5 7.5l4 4" />,
  bag: (
    <>
      <path d="M5 8h14l-1 12H6z" />
      <path d="M9 10V6.5a3 3 0 016 0V10" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="4" rx="1" />
      <path d="M5.5 13v7h13v-7M12 9v11" />
      <path d="M12 9c-1.5-3.5-5.5-4-5.5-1.5S10 9 12 9zM12 9c1.5-3.5 5.5-4 5.5-1.5S14 9 12 9z" />
    </>
  ),
  box: (
    <>
      <path d="M4 8l8-4 8 4v8l-8 4-8-4z" />
      <path d="M4 8l8 4 8-4M12 12v8" />
    </>
  ),
  shield: <path d="M12 3.5l7 2.8v5.2c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6.3zM8.8 12l2.2 2.2 4.2-4.4" />,
  truck: (
    <>
      <path d="M3.5 6.5h10v9h-10zM13.5 9.5h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5.5" y="4.5" width="13" height="16" rx="2" />
      <path d="M9 4.5V3.5h6v1M9 13l2 2 4-4.5" />
    </>
  ),
  store: (
    <>
      <path d="M4 9.5L5.5 4.5h13L20 9.5" />
      <path d="M4 9.5a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0 2.7 2.7 0 005.3 0" />
      <path d="M5.5 11.5v8h13v-8M10 19.5v-4.5h4v4.5" />
    </>
  ),
  card: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M3.5 9.5h17M7 15h4" />
    </>
  ),
  pix: (
    <>
      <path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z" />
      <path d="M8 12h8M12 8v8" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12.3l2.8 2.7L16 9.5" />
    </>
  ),
  home: <path d="M4.5 11L12 4.5l7.5 6.5M6.5 9.5v10h11v-10M10 19.5V14h4v5.5" />,
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z" />
      <path d="M9 8h6M9 11.5h6M9 15h4" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

type Props = SVGProps<SVGSVGElement> & { name: IconName; size?: number; title?: string };

export function Icon({ name, size = 20, title, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
