import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageHero
      title="Essa página saiu para um café"
      intro="O endereço pode ter mudado ou não existe mais. Que tal voltar para o começo?"
    >
      <div className="flex flex-col gap-3 xs:flex-row">
        <ButtonLink href="/" icon="arrowRight">
          Ir para o início
        </ButtonLink>
        <ButtonLink href="/cardapio" variant="outline">
          Ver cardápio
        </ButtonLink>
      </div>
    </PageHero>
  );
}
