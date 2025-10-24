# Nano Finance UI

Interface frontend moderna e responsiva para gerenciamento de finanças pessoais, desenvolvida com React, TypeScript e Tailwind CSS.

## Sobre o Projeto

Nano Finance UI é uma aplicação web para controle financeiro pessoal que permite aos usuários gerenciar suas contas, transações e visualizar um dashboard com informações consolidadas sobre suas finanças.

### Funcionalidades

- **Autenticação de Usuários**

  - Login e registro de usuários
  - Recuperação de senha
  - Reset de senha via token
  - Proteção de rotas autenticadas

- **Dashboard**

  - Visão geral das finanças
  - Gráficos e estatísticas
  - Resumo de receitas e despesas

- **Gerenciamento de Contas**

  - Cadastro de contas bancárias
  - Edição e exclusão de contas
  - Visualização de saldo

- **Gerenciamento de Transações**
  - Registro de receitas e despesas
  - Edição e exclusão de transações
  - Filtros e busca

## Tecnologias

- **[React 18](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Vite](https://vitejs.dev/)** - Build tool e dev server ultra-rápido
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes React reutilizáveis e acessíveis
- **[React Router DOM](https://reactrouter.com/)** - Roteamento para aplicações React
- **[TanStack Query](https://tanstack.com/query/)** - Gerenciamento de estado assíncrono
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript
- **[Lucide React](https://lucide.dev/)** - Ícones modernos
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos para React
- **[date-fns](https://date-fns.org/)** - Manipulação de datas

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **Bun** (gerenciador de pacotes) - [Instalação](https://bun.sh/)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Jaedsonn/nano-finance-ui.git
cd nano-finance-ui
```

2. Instale as dependências:

```bash
bun install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

> **Nota:** Ajuste a URL da API conforme o endereço do seu backend.

## Executando o Projeto

### Modo Desenvolvimento

```bash
bun run dev
```

A aplicação estará disponível em `http://localhost:8080`

### Build para Produção

```bash
bun run build
```

### Preview do Build

```bash
bun run preview
```

### Linting

```bash
bun run lint
```

## Estrutura do Projeto

```
nano-finance-ui/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── ui/         # Componentes shadcn/ui
│   │   ├── Layout/     # Componentes de layout
│   │   ├── Accounts/   # Componentes de contas
│   │   └── Transactions/ # Componentes de transações
│   ├── contexts/        # Contextos React (AuthContext)
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilitários e configurações
│   │   ├── api.ts     # Cliente HTTP
│   │   ├── types.ts   # Tipos TypeScript
│   │   └── utils.ts   # Funções utilitárias
│   ├── pages/          # Páginas da aplicação
│   ├── App.tsx         # Componente raiz
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais
├── components.json      # Configuração shadcn/ui
├── tailwind.config.ts  # Configuração Tailwind
├── tsconfig.json       # Configuração TypeScript
├── vite.config.ts      # Configuração Vite
└── package.json        # Dependências e scripts
```

## Componentes UI

Este projeto utiliza componentes do **shadcn/ui**, uma coleção de componentes reutilizáveis construídos com Radix UI e Tailwind CSS. Os componentes disponíveis incluem:

- Formulários (Input, Select, Checkbox, etc.)
- Diálogos e Modais
- Tabelas
- Cards
- Botões
- Navegação (Sidebar, Breadcrumb, etc.)
- Feedback (Toast, Alert, etc.)
- E muito mais...

## Integração com Backend

A aplicação se comunica com uma API REST através do cliente HTTP configurado em `src/lib/api.ts`. O cliente inclui:

- Gerenciamento automático de tokens de autenticação
- Interceptação de erros
- Feedback visual via toasts
- Tipagem TypeScript para requisições e respostas

### Endpoints Principais

- `POST /auth/login` - Autenticação de usuário
- `POST /auth/register` - Registro de novo usuário
- `POST /auth/forgot-password` - Solicitação de reset de senha
- `POST /auth/reset-password` - Reset de senha via token
- `GET /accounts` - Lista de contas
- `POST /accounts` - Criar conta
- `GET /transactions` - Lista de transações
- `POST /transactions` - Criar transação

## Rotas

| Rota               | Descrição                     | Proteção  |
| ------------------ | ----------------------------- | --------- |
| `/`                | Redireciona para `/dashboard` | -         |
| `/auth`            | Página de login/registro      | Pública   |
| `/forgot-password` | Recuperação de senha          | Pública   |
| `/reset-password`  | Reset de senha                | Pública   |
| `/dashboard`       | Dashboard principal           | Protegida |
| `/accounts`        | Gerenciamento de contas       | Protegida |
| `/transactions`    | Gerenciamento de transações   | Protegida |
| `*`                | Página 404                    | Pública   |

## Boas Práticas

- Componentes reutilizáveis e modulares
- Tipagem forte com TypeScript
- Validação de formulários com Zod
- Gerenciamento de estado com Context API e TanStack Query
- Código limpo e organizado
- Responsividade mobile-first
- Acessibilidade com Radix UI

## Deploy

O projeto está configurado para deploy na Vercel através do arquivo `vercel.json`. Para fazer deploy:

1. Instale a CLI da Vercel:

```bash
npm i -g vercel
```

2. Execute o deploy:

```bash
vercel
```

Ou conecte seu repositório diretamente na plataforma Vercel para deployments automáticos.

## Licença

Este projeto é privado e de uso pessoal.

## Autor

**Jaedson**

- GitHub: [@Jaedsonn](https://github.com/Jaedsonn)

## Contribuindo

Como este é um projeto pessoal, contribuições não estão abertas no momento. No entanto, sugestões e feedbacks são bem-vindos!

---

Desenvolvido com muito café
