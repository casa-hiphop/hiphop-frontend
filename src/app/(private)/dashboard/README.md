# Dashboard - Ferramentoteca

Sistema de gestão de ferramentas com visualização de estatísticas, gráficos e atividades recentes.

## 📁 Estrutura de Arquivos

```
src/app/(private)/dashboard/
├── layout.tsx              # Layout do dashboard (wrapper básico)
├── page.tsx                # Página principal com grid e composição
└── README.md               # Esta documentação

src/components/
├── header.tsx              # Cabeçalho com título, notificações e avatar
├── sidebar.tsx             # Menu lateral de navegação
├── stats-cards.tsx         # Cards de estatísticas (Ferramentas, Unidades, Solicitantes)
├── loan-chart.tsx          # Gráfico de empréstimos (Recharts)
└── recent-activities.tsx   # Lista de atividades recentes
```

## 🎨 Componentes do Dashboard

### Header (`src/components/header.tsx`)
- **Título**: "Ferramentoteca - Dashboard"
- **Notificações**: Ícone de sino com badge de contagem e dropdown
- **Avatar**: Iniciais do usuário com fallback "AD"
- **Cores**: Usa `bg-card`, `text-foreground`, `bg-primary`

### Sidebar (`src/components/sidebar.tsx`)
- **Logo**: Ícone de ferramenta com título "Ferramentoteca"
- **Menu Items**:
  - Dashboard (LayoutDashboard icon)
  - Cadastro de Ferramentas (Wrench icon)
  - Cadastro de Unidades (Building2 icon)
  - Cadastro de Solicitantes (Users icon)
- **Interação**: Estado ativo com `currentPage` prop
- **Cores**: Usa `bg-sidebar`, `bg-sidebar-primary`, `text-sidebar-foreground`

### StatsCards (`src/components/stats-cards.tsx`)
3 cards com estatísticas:
1. **Ferramentas**: 156 total (98 disponíveis, 58 emprestadas)
2. **Unidades**: 12 total
3. **Solicitantes**: 248 total
- **Ícones**: Wrench, Building2, Users (lucide-react)
- **Cores**: Usa `text-foreground`, `text-muted-foreground`, `text-chart-1`, `text-chart-2`

### LoanChart (`src/components/loan-chart.tsx`)
- **Biblioteca**: Recharts (LineChart)
- **Dados**: Empréstimos mensais (Jan-Jun)
- **Elementos**: CartesianGrid, XAxis, YAxis, Tooltip, Line
- **Cores**: Usa `text-foreground`, `text-muted-foreground`

### RecentActivities (`src/components/recent-activities.tsx`)
Lista de 5 atividades com:
- **Tipos**: Devolução, novo cadastro, atraso, nova ferramenta
- **Ícones**: CheckCircle, UserPlus, AlertCircle, Clock
- **Informações**: Mensagem + horário
- **Scroll**: max-h-[300px] com overflow-y-auto
- **Cores**: Usa `text-foreground`, `text-muted-foreground`, `hover:bg-muted`

## 🔧 Layout da Página (`page.tsx`)

```tsx
<div className="flex h-screen bg-background">
  <Sidebar />
  <div className="flex-1 flex flex-col">
    <Header />
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LoanChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivities />
        </div>
      </div>
    </main>
  </div>
</div>
```

## 📦 Dependências

- **Recharts**: `2.12.7` (instalado com `--legacy-peer-deps`)
- **Lucide React**: Ícones (Bell, Wrench, Building2, Users, etc)
- **Shadcn/ui**: Card, Button, Avatar, DropdownMenu
- **Tailwind CSS**: Classes utilitárias com tema customizado

## 🎨 Sistema de Cores

Todos os componentes usam variáveis CSS do tema (`globals.css`):
- `bg-card` / `text-card-foreground`
- `bg-sidebar` / `text-sidebar-foreground`
- `bg-primary` / `text-primary-foreground`
- `text-muted-foreground`
- `bg-muted`
- `text-chart-1`, `text-chart-2` (para dados)

Suporte automático para dark mode via classe `.dark`.

## 🚀 Acesso

- **Rota**: `/dashboard`
- **Autenticação**: Temporariamente pública (via `publicRoutes` no middleware)
- **Porta de dev**: `http://localhost:3000/dashboard`

## 📝 Notas de Implementação

- O layout do dashboard é um segment layout (não root layout)
- Import de `globals.css` via `../../globals.css`
- Estado de navegação gerenciado por `useState` no `page.tsx`
- Componentes são todos client components (`"use client"`)
- Grid responsivo: mobile (1 col) → desktop (3 cols)

## 🔧 Arquivos Modificados/Criados

### Criados
1. `src/app/(private)/dashboard/layout.tsx` - Layout do segmento
2. `src/app/(private)/dashboard/page.tsx` - Página principal
3. `src/app/(private)/dashboard/README.md` - Esta documentação
4. `src/components/header.tsx` - Componente de cabeçalho
5. `src/components/sidebar.tsx` - Componente de menu lateral
6. `src/components/stats-cards.tsx` - Cards de estatísticas
7. `src/components/loan-chart.tsx` - Gráfico de empréstimos
8. `src/components/recent-activities.tsx` - Lista de atividades

### Modificados
1. **`src/middleware.ts`**
   - Adicionado `/dashboard` em `publicRoutes` temporariamente
   - Permite acesso sem login para preview

2. **`package.json`**
   - Adicionado `recharts@2.12.7` nas dependências
   - Instalado com `--legacy-peer-deps` (React 19 compatibility)
   - Adicionado `@vercel/analytics` para métricas

3. **`eslint.config.mjs`**
   - Adicionado ignore pattern para `.next/**/*`
   - Evita erros de lint em arquivos gerados

4. **`env.sample`**
   - Adicionado `NEXT_PUBLIC_AUTH_BYPASS=false` (não usado na versão final)

### Arquivos Temporários Removidos
- `src/app/dashboard/*` (duplicado, causava conflito de rotas)
- `src/components/header.tsx`, `sidebar.tsx`, etc (versões antigas com componentes locais)

## ⚠️ Pendências/TODO

1. **Remover acesso público ao dashboard**
   - Remover linha `{ path: "/dashboard", whenAuthenticated: "next" }` do `src/middleware.ts`
   - Dashboard voltará a exigir autenticação

2. **Conectar dados reais**
   - StatsCards: buscar totais via API
   - LoanChart: buscar dados mensais via API
   - RecentActivities: buscar atividades via API/WebSocket

3. **Implementar navegação funcional**
   - Criar rotas para Ferramentas, Unidades, Solicitantes
   - Conectar cliques do Sidebar às rotas

4. **Melhorias de UX**
   - Loading states nos componentes
   - Error boundaries
   - Skeleton loaders
   - Toast notifications para ações
