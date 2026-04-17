# Casa do Hip Hop — Frontend

Interface web do sistema de gestão da **Casa do Hip Hop**: cadastro e acompanhamento de unidades, ferramentas, solicitantes e empréstimos, com autenticação e painel administrativo.

## Stack

- **Next.js** 15 (App Router, Turbopack em desenvolvimento)
- **React** 19 e **TypeScript**
- **Tailwind CSS** 4 e componentes **shadcn/ui** (estilo *New York*, **Radix UI**)
- **React Hook Form** + **Zod** para formulários
- **SWR** para dados remotos
- **next-themes** (claro/escuro/sistema)
- **js-cookie** / `localStorage` para sessão (token JWT + dados do usuário)
- **@vercel/analytics** (métricas, quando aplicável)

A API consumida é a do repositório **hiphop-backend** (Fastify + PostgreSQL).

## Requisitos

- **Node.js** 20+ (recomendado; alinhado ao CI em `.github/workflows`)
- Backend em execução e acessível na URL configurada em `NEXT_PUBLIC_API_URL`

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo **`.env.local`** na raiz do projeto (Next.js carrega variáveis `NEXT_PUBLIC_*` no build e no browser):

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_API_URL` | Sim | URL base da API (ex.: `http://localhost:3333`), **sem** barra no final |
| `NEXT_PUBLIC_APP_NAME` | Sim | Identificador usado como chave no `localStorage` para persistir o usuário logado (ex.: `casa-hiphop-web`) |

Exemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_APP_NAME=casa-hiphop-web
```

Sem `NEXT_PUBLIC_APP_NAME`, o fluxo de login falha com erro de configuração (ver `src/contexts/auth.tsx`).

3. **Imagens remotas**: o `next.config.ts` permite imagens de `http://localhost:3333/uploads/**`. Se a API em produção usar outro host/porta, ajuste `images.remotePatterns` conforme necessário.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (`next dev --turbo`) |
| `npm run build` | Build de produção |
| `npm start` | Servidor após build (`next start`) |
| `npm run lint` | ESLint (`next lint`) |

Desenvolvimento: [http://localhost:3000](http://localhost:3000) (porta padrão do Next.js).

## Rotas principais

| Área | Caminhos |
|------|-----------|
| Público | `/` — landing; `/login`, `/register`, `/forget-password`, `/reset-password/[token]` |
| Autenticado | `/dashboard`, `/unidades`, `/cadastro-unidade`, `/ferramentas`, `/solicitantes`, `/emprestimo` |

A proteção de rotas é feita no **cliente** (`AuthProvider`): ausência de token redireciona para `/login`; usuários logados em rotas públicas configuradas como “redirect” vão para `/dashboard` (ver `publicRoutes` em `src/contexts/auth.tsx`).

## Estrutura do projeto (resumo)

- `src/app/` — rotas e layouts (grupos `(public)` e `(private)`)
- `src/api/` — cliente HTTP e módulos por domínio (`auth`, `users`, `units`, `tools`, `requesters`, `borrows`)
- `src/components/` — UI compartilhada (sidebar, header, componentes shadcn)
- `src/contexts/` — provedores (auth, tema, etc.)
- `src/dtos/` — tipos alinhados à API

## Docker

Há um `Dockerfile` (Node 22 na imagem base) e um `docker-compose.yml` que espera variáveis como `IMAGE_NAME`, `VERSION` e `PORT` para build e publicação da porta. Ajuste conforme o ambiente antes de subir o container.

## CI/CD

No push para `main`, o workflow em `.github/workflows/ci-cd.yml` faz checkout, configura Node 20 e, no deploy, sincroniza o código com o servidor via `rsync` e executa `./release.sh` no destino (`.env` não é enviado; configure variáveis no servidor ou no provedor).

## Relação com o backend

- Login: `POST /login` — o token JWT é guardado em `localStorage` e enviado como `Authorization: Bearer` nas requisições (`src/api/index.ts`).
- CORS da API deve permitir a origem deste front (em produção, a API já considera `FRONTEND_URL` e hosts conhecidos).

---

**Casa do Hip Hop** — Sistema de gerenciamento de ferramentas.
