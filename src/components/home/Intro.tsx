import { TextLink } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { photos } from "@/content/photos";

export function Intro() {
  return (
    <section aria-labelledby="intro-title" className="page-x py-20 sm:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow mb-3">Bem-vindo à JDS</p>
          <h2 id="intro-title" className="text-h2">
            Um café para tomar com calma
          </h2>
          <div className="mt-5 space-y-4 text-lede text-mocha">
            <p>
              Madeira, tijolo aparente, plantas e muita luz natural. A JDS é um lugar para fazer uma pausa no dia,
              encontrar os amigos ou simplesmente aproveitar um bom café.
            </p>
            <p>Da fachada de ripas ao balcão, cada canto foi pensado para receber bem quem chega.</p>
          </div>
          <TextLink href="/experiencia" className="mt-6">
            Conheça o espaço
          </TextLink>
        </div>
        <PhotoFrame
          photo={photos.interior}
          ratio="4/5"
          sizes="(min-width: 768px) 40vw, 100vw"
          className="mx-auto w-full max-w-md md:max-w-none"
        />
      </div>
    </section>
  );
}
