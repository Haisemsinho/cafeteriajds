import { getImageProps } from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/content/photos";

export function Hero() {
  const shared = { alt: "", sizes: "100vw", fetchPriority: "high" as const };
  const desktop = getImageProps({ ...shared, src: photos.xicara.src, loading: "eager" }).props;
  const { srcSet: mobileSrcSet, ...mobile } = getImageProps({ ...shared, src: photos.fachada.src, loading: "eager" }).props;

  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex h-[78svh] min-h-[32rem] max-h-[46rem] items-end overflow-hidden bg-espresso text-paper md:h-[min(82vh,44rem)] md:items-center"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
        <img
          {...mobile}
          srcSet={mobileSrcSet}
          alt=""
          className="absolute inset-0 -z-10 size-full object-cover object-[50%_20%] md:object-[70%_50%]"
        />
      </picture>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-espresso/90 via-espresso/45 to-espresso/10 md:bg-linear-to-r md:from-espresso/80 md:via-espresso/45 md:to-transparent"
      />

      <div className="page-x pb-12 md:pb-0">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold text-sand">JDS Cafeteria</p>
          <h1 id="hero-title" className="text-display text-paper">
            Seu café. Seu momento.
          </h1>
          <p className="mt-5 max-w-md text-lede text-paper/85">
            Um espaço para apreciar bons sabores e aproveitar cada pausa.
          </p>
          <div className="mt-8 flex flex-col gap-3 xs:flex-row">
            <ButtonLink href="/cardapio" icon="arrowRight">
              Explorar cardápio
            </ButtonLink>
            <ButtonLink href="/nossa-historia" variant="outline-light">
              Conheça a JDS
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
