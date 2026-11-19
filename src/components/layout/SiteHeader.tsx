"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn, stagger } from "@/lib/cn";
import { isActive, mainNav } from "@/lib/navigation";
import { CartButton } from "@/components/order/CartButton";
import { Logo, type Brand } from "./Logo";

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

type Props = { brand: Brand; instagram?: { url: string; handle: string }; ordering?: boolean };

export function SiteHeader({ brand, instagram, ordering }: Props) {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [intro] = useState(() => pathname === "/");

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
        "on-dark sticky top-0 z-50 border-b text-white transition-[border-color,box-shadow] duration-300 ease-out-expo",
        pathname === "/" ? "header-overlay" : "bg-night",
        scrolled ? "border-line-dark shadow-[0_10px_30px_-14px_rgb(0_0_0/0.6)]" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "page-x flex h-16 items-center justify-between gap-3 sm:gap-6 lg:h-[4.5rem]",
          intro && "header-intro",
        )}
      >
        <Link href="/" className="-my-2 py-2 text-white" aria-label={`${brand.name}, página inicial`}>
          <Logo brand={brand} className={ordering ? "max-[359px]:[&>span+span]:hidden" : undefined} />
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
                      "group/nav relative flex min-h-11 items-center rounded-md px-3 text-[0.9375rem] transition-colors duration-300 lg:px-4",
                      active ? "font-semibold text-white" : "text-white/75 hover:text-white",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-3 bottom-0.5 h-0.5 origin-left rounded-full bg-caramel transition-transform duration-500 ease-out-expo lg:inset-x-4",
                        active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {ordering ? <CartButton compact /> : null}
          <button
            type="button"
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="-mr-2 inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-[0.9375rem] font-semibold text-white hover:bg-white/10 md:hidden"
          >
            <Icon name="menu" size={22} />
            Menu
          </button>
        </div>
        {ordering ? (
          <div className="hidden md:block">
            <CartButton />
          </div>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        id="menu-mobile"
        aria-label="Menu de navegação"
        onClose={() => setMenuOpen(false)}
        className="sheet on-dark md:hidden"
      >
        <div className="flex min-h-full flex-col px-6 pb-8">
          <div className="flex h-16 items-center justify-between">
            <Logo brand={brand} />
            <button
              type="button"
              onClick={closeMenu}
              className="-mr-3 grid size-11 place-items-center rounded-md hover:bg-white/10"
              aria-label="Fechar menu"
            >
              <Icon name="close" size={22} />
            </button>
          </div>

          <nav aria-label="Principal" className="mt-4 flex-1">
            <ul className="divide-y divide-line-dark border-y border-line-dark">
              {mainNav.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="sheet-item" style={stagger(i, 8)}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-16 items-center justify-between font-display text-[1.75rem] leading-none",
                        active ? "text-caramel-light" : "text-white",
                      )}
                    >
                      {item.label}
                      <Icon name="chevronRight" size={18} className="text-white/40" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {ordering ? (
            <ul className="sheet-item mt-6 grid grid-cols-2 gap-2" style={stagger(mainNav.length, 8)}>
              <li>
                <Link
                  href="/carrinho"
                  onClick={closeMenu}
                  className="flex min-h-14 items-center gap-2 rounded-2xl border border-line-dark px-4 font-semibold text-white hover:bg-white/10"
                >
                  <Icon name="bag" size={20} className="text-caramel-light" />
                  Carrinho
                </Link>
              </li>
              <li>
                <Link
                  href="/minhas-compras"
                  onClick={closeMenu}
                  className="flex min-h-14 items-center gap-2 rounded-2xl border border-line-dark px-4 font-semibold text-white hover:bg-white/10"
                >
                  <Icon name="receipt" size={20} className="text-caramel-light" />
                  Minhas compras
                </Link>
              </li>
            </ul>
          ) : null}

          <div className="sheet-item mt-8 flex flex-col gap-3" style={stagger(mainNav.length, 8)}>
            <ButtonLink href="/cardapio" onClick={closeMenu} icon="arrowRight">
              Explorar cardápio
            </ButtonLink>
            {instagram ? (
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-sand hover:text-white"
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
