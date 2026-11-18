# Pendências comerciais

Tudo que a JDS Cafeteria precisa fornecer ou aprovar antes de o site ir ao ar.

## 1. Autorização

- [ ] Autorização do proprietário para criar e publicar o site
- [ ] Aprovação do layout apresentado
- [ ] Quem pode aprovar mudanças de conteúdo e preço
- [ ] Domínio desejado (ex.: cafeteriajds.com.br) e em nome de quem ele será registrado

Enquanto isso, o site não deve ser publicado em endereço público. A versão de demonstração já sai com `noindex`.

## 2. Marca

- [ ] Logotipo oficial em SVG, ou PNG com fundo transparente de pelo menos 1000 px de largura
- [ ] Versão do logo para fundo escuro (o header e o rodapé são pretos)
- [ ] Confirmação do nome como deve aparecer: "JDS Cafeteria"
- [ ] Significado de "JDS", se quiserem contar

Hoje o site usa um logotipo só de texto.

## 3. Cardápio e preços

- [ ] Lista real de produtos por categoria
- [ ] Preço de cada item, e de cada tamanho quando houver
- [ ] Volume de cada tamanho (ex.: 180 ml, 300 ml)
- [ ] Itens servidos quente e gelado
- [ ] Itens que entram nos destaques da página inicial
- [ ] Ingredientes, só se quiserem mostrar
- [ ] Alergênicos conferidos pela cozinha, com data
- [ ] Itens sazonais e o período de cada um
- [ ] Produtos embalados, presentes ou kits, se existirem, e como encomendar

## 4. Fotografias

- [ ] Originais em alta resolução das fotos enviadas
- [ ] Uma foto horizontal do salão em alta resolução para o topo do site no computador
- [ ] Fotos dos produtos (substituem as ilustrações)
- [ ] Autorização de uso de todas as fotos e nome de quem fotografou
- [ ] Autorização das pessoas que aparecem nas fotos

### Fotos usadas hoje

| arquivo | origem | largura | onde aparece | observação |
| --- | --- | --- | --- | --- |
| fachada.jpg | foto enviada da fachada | 335 px | topo no celular, galeria, história | tem a marca "b2" e uma cliente sentada no salão |
| fachada-letreiro.jpg | recorte da fachada | 335 px | história, experiência | |
| fachada-varanda.jpg | recorte da fachada | 200 px | galeria, experiência | mostra o @cafeteriajds no vidro |
| interior.jpg | foto enviada do salão | 335 px | início, experiência | tem decoração de Natal |
| prateleiras.jpg | recorte do salão | 240 px | galeria, experiência, história | |
| balcao.jpg | recorte do salão | 335 px | galeria, produtos | |
| xicara.jpg | recorte da peça do Dia do Café | 386 px | topo no computador, galeria | |
| dia-do-cafe.jpg | peça de comunicação enviada | 386 px | galeria, produtos, história | tem texto da campanha de 1 de outubro |
| og.jpg | montagem com a fachada | 1200 px | compartilhamento do link | refazer com a foto original |

Todas aparecem ampliadas 2 a 4 vezes em telas grandes. Com os originais, a qualidade melhora sem mudar nada no código.

## 5. História da marca

- [ ] Como a cafeteria começou
- [ ] Quem são os donos (nome, foto, um texto curto)
- [ ] Ano de inauguração
- [ ] Valores da marca
- [ ] Fotos antigas (obra, inauguração)
- [ ] Aprovação ou ajuste do texto "Receber bem é parte do café"

## 6. Endereço e horários

- [ ] Endereço completo com CEP e ponto de referência
- [ ] Link do Google Maps
- [ ] Horário de cada dia da semana, inclusive intervalos
- [ ] Feriados e datas com horário especial
- [ ] Confirmação de que o endereço bate com o Perfil da Empresa no Google

## 7. Contatos

- [ ] Número oficial de WhatsApp
- [ ] Telefone fixo, se houver
- [ ] E-mail, se quiserem publicar
- [ ] Confirmação do Instagram @cafeteriajds (visto no vidro da fachada)
- [ ] Outras redes ou apps de entrega

## 8. Hospedagem

- [ ] Escolha da hospedagem e de quem paga
- [ ] Quem terá acesso à conta da hospedagem e ao domínio

## O que é demonstrativo hoje

Tudo abaixo aparece só na versão de apresentação, sempre identificado.

| conteúdo | onde está | como aparece |
| --- | --- | --- |
| 14 produtos genéricos | `src/content/menu.ts` (`dataStatus: "draft"`) | aviso no topo do cardápio e da home; aviso em cada página de produto |
| preços | mesmos produtos | "preço de exemplo" ao lado de cada valor |
| imagens dos produtos | ilustrações em `ProductIllustration.tsx` | selo "Ilustração" na página do produto; aviso de imagens demonstrativas nos destaques |
| destaques da página Produtos | `src/content/highlights.ts` | selo "Exemplo" em cada cartão |
| texto de apresentação da história | `src/content/story.ts` | selo "Texto provisório" |
| texto "Receber bem é parte do café" | `src/content/story.ts` | selo "Proposta de texto" |
| capítulos da história | `src/content/story.ts` (`pending`) | cartões "A preencher" |
| aviso de exemplo do contato | `src/content/business.ts` | aparece como "Aviso de exemplo" |

Na versão de produção, sem `SHOW_DRAFT_CONTENT`, nada disso aparece. O cardápio, os destaques e a página Produtos mostram estados vazios até o conteúdo real entrar.

### Textos de campanha

Estes textos são sugestões, aparecem também em produção e podem ser trocados em `src/content/home.ts`:

- "Bem-vindo à JDS Cafeteria"
- "Seu lugar para apreciar um bom café e viver bons momentos."
- "Um café para tomar com calma"
- "Nossos Destaques" e "Sabores especiais para acompanhar seus melhores momentos."
- "Cada lugar tem uma história"
- "Venha nos visitar"

## Custos possíveis

Valores de referência, sujeitos a mudança:

| item | custo | observação |
| --- | --- | --- |
| domínio .com.br | cerca de R$ 40 por ano | valor do Registro.br |
| hospedagem Vercel | US$ 20 por mês (plano Pro) | o plano gratuito não permite uso comercial |
| hospedagem alternativa | varia | o site é quase todo estático e roda em outras hospedagens compatíveis com Next.js |
| fotógrafo | a combinar | para fotos do salão e dos produtos |
| manutenção | a combinar | troca de cardápio, preços e fotos |

O site não usa banco de dados, serviço de e-mail, mapa pago nem nenhuma outra API paga. O WhatsApp e o Instagram são só links.
