"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { isActive, mainNav } from "@/lib/navigation";
import { Logo } from "./Logo";

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

type Props = { instagram?: { url: string; handle: string } };

export function SiteHeader({ instagram }: Props) {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-porcelain/95 backdrop-blur-sm transition-[border-color,box-shadow] duration-200",
        scrolled ? "border-line shadow-[0_6px_20px_-16px_rgb(38_26_21/0.35)]" : "border-transparent",
      )}
    >
      <div className="page-x flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Link href="/" className="-my-2 py-2 text-espresso" aria-label="JDS Cafeteria, página inicial">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block rounded-md px-3 py-2 text-[0.9375rem] transition-colors duration-200 lg:px-4",
                      active ? "font-semibold text-espresso" : "text-mocha hover:bg-cream-soft hover:text-espresso",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span aria-hidden className="absolute inset-x-3 bottom-0.5 h-0.5 rounded-full bg-caramel-deep lg:inset-x-4" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={openMenu}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          className="-mr-2 inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-[0.9375rem] font-semibold text-espresso hover:bg-cream-soft md:hidden"
        >
          <Icon name="menu" size={22} />
          Menu
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="menu-mobile"
        aria-label="Menu de navegação"
        onClose={() => setMenuOpen(false)}
        className="sheet md:hidden"
      >
        <div className="flex min-h-full flex-col px-6 pb-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={closeMenu}
              className="-mr-3 grid size-11 place-items-center rounded-md hover:bg-cream-soft"
              aria-label="Fechar menu"
            >
              <Icon name="close" size={22} />
            </button>
          </div>

          <nav aria-label="Principal" className="mt-4 flex-1">
            <ul className="divide-y divide-line border-y border-line">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 items-center justify-between text-lg",
                        active ? "font-semibold text-caramel-deep" : "font-medium text-espresso",
                      )}
                    >
                      {item.label}
                      <Icon name="chevronRight" size={18} className="text-latte" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink href="/cardapio" onClick={closeMenu} icon="arrowRight">
              Explorar cardápio
            </ButtonLink>
            {instagram ? (
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-mocha hover:text-espresso"
              >
                <Icon name="instagram" size={18} />
                {instagram.handle}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            ) : null}
          </div>
        </div>
      </dialog>
    </header>
  );
}
