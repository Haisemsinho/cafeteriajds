import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";

export default function ProductNotFound() {
  return (
    <div className="page-x py-20 sm:py-24">
      <EmptyState
        icon="search"
        headingLevel={1}
        title="Produto não encontrado"
        action={
          <ButtonLink href="/cardapio" icon="arrowRight">
            Ver o cardápio
          </ButtonLink>
        }
      >
        Esse item pode ter saído do cardápio ou o endereço está incorreto.
      </EmptyState>
    </div>
  );
}
