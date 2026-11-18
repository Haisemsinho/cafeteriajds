import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "dark" | "light" | "outline" | "outline-light";

const variants: Record<Variant, string> = {
  primary: "bg-caramel-deep text-paper hover:bg-walnut",
  dark: "bg-espresso text-paper hover:bg-walnut",
  light: "bg-paper text-espresso hover:bg-cream",
  outline: "border border-line-strong bg-paper/40 text-espresso hover:border-espresso",
  "outline-light": "border border-paper/60 text-paper hover:bg-paper hover:text-espresso",
};

const sizes = {
  md: "min-h-12 px-6 text-[0.9375rem]",
  sm: "min-h-11 px-4 text-sm",
};

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-[background-color,color,border-color] duration-200 ease-soft disabled:pointer-events-none disabled:opacity-50";

type Own = { variant?: Variant; size?: keyof typeof sizes; icon?: IconName; children: ReactNode; className?: string };

function Inner({ icon, children }: { icon?: IconName; children: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      {icon ? (
        <Icon
          name={icon}
          size={18}
          className="-mr-1 transition-transform duration-200 ease-soft group-hover/btn:translate-x-0.5"
        />
      ) : null}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  external,
  ...rest
}: Own & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  const classes = cn(base, sizes[size], variants[variant], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        <Inner icon={icon}>{children}</Inner>
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  type = "button",
  ...rest
}: Own & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}

export function TextLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const classes = cn(
    "group/link inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold text-caramel-deep hover:text-walnut",
    className,
  );
  const content = (
    <>
      <span className="underline-offset-4 group-hover/link:underline">{children}</span>
      <Icon
        name={external ? "arrowUpRight" : "arrowRight"}
        size={16}
        className="transition-transform duration-200 ease-soft group-hover/link:translate-x-0.5"
      />
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
