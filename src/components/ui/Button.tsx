import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "dark" | "light" | "outline" | "outline-light";

const variants: Record<Variant, string> = {
  primary:
    "bg-caramel-deep text-white shadow-[0_10px_24px_-12px_rgb(156_95_34/0.8)] hover:bg-caramel-dark hover:shadow-[0_14px_30px_-12px_rgb(156_95_34/0.9)]",
  dark: "bg-night text-white hover:bg-walnut",
  light: "bg-white text-night hover:bg-cream-soft",
  outline:
    "border border-line-strong bg-transparent text-espresso hover:border-espresso hover:bg-espresso hover:text-white",
  "outline-light":
    "border border-white/60 text-white backdrop-blur-[2px] hover:border-white hover:bg-white hover:text-night",
};

const sizes = {
  md: "min-h-12 px-7 text-[0.9375rem]",
  sm: "min-h-11 px-5 text-sm",
};

const base =
  "press group/btn inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,border-color,box-shadow] duration-300 ease-soft disabled:pointer-events-none disabled:opacity-50";

type Own = { variant?: Variant; size?: keyof typeof sizes; icon?: IconName; children: ReactNode; className?: string };

function Inner({ icon, children }: { icon?: IconName; children: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      {icon ? (
        <Icon
          name={icon}
          size={18}
          className="-mr-1 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1"
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
    "group/link inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold text-caramel-deep hover:text-caramel-dark",
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
