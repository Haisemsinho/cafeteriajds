export type NavItem = { href: string; label: string };

export const mainNav: NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/nossa-historia", label: "Nossa História" },
  { href: "/experiencia", label: "Experiência" },
  { href: "/contato", label: "Contato" },
];

export const footerNav: NavItem[] = [
  ...mainNav.slice(0, 4),
  { href: "/produtos", label: "Produtos e novidades" },
  mainNav[4] as NavItem,
];

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
