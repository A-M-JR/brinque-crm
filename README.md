# 🚀 BitWise Agency System

Um sistema abrangente de CRM (Customer Relationship Management) construído com Next.js, projetado para gerenciar usuários, leads, produtos, estoque, pedidos e muito mais. O sistema oferece dashboards distintos e funcionalidades específicas para diferentes perfis de usuário: Administrador, Distribuidor e Revendedor.

## ✨ Funcionalidades Principais

*   **Acesso Baseado em Papéis:** Dashboards e funcionalidades personalizadas para Administradores, Distribuidores e Revendedores.
*   **Gestão de Usuários:** Criação, edição e visualização de usuários com diferentes permissões.
*   **Gestão de Leads:** Acompanhamento e gerenciamento de leads de vendas.
*   **Gestão de Produtos e Estoque:** Controle detalhado de produtos e níveis de estoque para Distribuidores e Revendedores.
*   **Gestão de Pedidos:** Criação, visualização e acompanhamento de pedidos com detalhes completos.
*   **Loja Integrada:** Um storefront para visualização e compra de produtos.
*   **Integrações:** Suporte para integrações com serviços de pagamento (PagSeguro), logística (Correios) e envio (Mais Envio).
*   **Gestão de Plataformas:** Controle de ativação/suspensão de plataformas.
*   **Relatórios e Indicadores:** Visualização de dados e métricas importantes para cada perfil.

## 🛠️ Tecnologias Utilizadas

*   **Next.js (App Router):** Framework React para aplicações web.
*   **React:** Biblioteca JavaScript para construção de interfaces de usuário.
*   **TypeScript:** Superset de JavaScript que adiciona tipagem estática.
*   **Tailwind CSS:** Framework CSS utilitário para estilização rápida e responsiva.
*   **shadcn/ui:** Componentes de UI reutilizáveis e acessíveis.
*   **Server Components & Server Actions:** Para otimização de performance e segurança no Next.js.
*   **Lucide React:** Biblioteca de ícones.

## ⚙️ Configuração do Projeto

Siga estas instruções para configurar e rodar o projeto localmente.

### Pré-requisitos

Certifique-se de ter o Node.js (versão 18.x ou superior) e o npm (ou yarn/pnpm) instalados em sua máquina.

### Instalação

1.  **Clone o repositório:**
    \`\`\`bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd crm-saas-system
    \`\`\`
    *(Nota: Se você baixou o código diretamente do v0, pule o passo de clonagem e vá para a pasta do projeto.)*

2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    \`\`\`

### Variáveis de Ambiente

Este projeto utiliza dados mockados para simular o comportamento do sistema. No entanto, para futuras implementações de autenticação real (e.g., com NextAuth.js) e conexão com banco de dados, você precisaria configurar variáveis de ambiente.

Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis (exemplo para NextAuth.js):

\`\`\`env
AUTH_SECRET="SEU_SEGREDO_DE_AUTENTICACAO_AQUI"
AUTH_URL="http://localhost:3000/api/auth" # Ou a URL de deploy
# DATABASE_URL="sua_string_de_conexao_com_o_banco_de_dados"
\`\`\`
*Substitua `SEU_SEGREDO_DE_AUTENTICACAO_AQUI` por uma string aleatória e segura.*

### Rodando o Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

O aplicativo estará disponível em `http://localhost:3000`.

## 📂 Estrutura do Projeto

A estrutura do projeto segue as convenções do Next.js App Router:

*   `app/`: Contém as rotas e páginas da aplicação, organizadas por perfil de usuário (admin, distribuidor, revendedor) e funcionalidades (clientes, pedidos, estoque, etc.).
*   `components/`: Componentes React reutilizáveis, incluindo componentes de UI do shadcn/ui e componentes customizados (e.g., `clientes-page.tsx`, `pedidos-page.tsx`).
*   `lib/`: Funções utilitárias, lógica de autenticação (`auth.ts`), e dados mockados (`mock-data.ts`, `users.ts`).
*   `hooks/`: Custom hooks React para lógica reutilizável (e.g., `use-clientes.ts`, `use-pedidos.ts`).
*   `public/`: Ativos estáticos como imagens.
*   `styles/`: Arquivos CSS globais e de tema.

## 🔑 Como Usar

O sistema é projetado com acesso baseado em papéis. Você pode testar os diferentes perfis de usuário fazendo login com as credenciais mockadas:

*   **Administrador:**
    *   Usuário: `admin@example.com`
    *   Senha: `password`
*   **Distribuidor:**
    *   Usuário: `distribuidor@example.com`
    *   Senha: `password`
*   **Revendedor:**
    *   Usuário: `revendedor@example.com`
    *   Senha: `password`

Após o login, você será redirecionado para o dashboard correspondente ao seu perfil, onde poderá explorar as funcionalidades específicas.

## 💡 Próximos Passos e Melhorias Futuras

Este projeto é uma base sólida e pode ser expandido com as seguintes melhorias:

*   **Autenticação Real:** Implementar autenticação robusta com NextAuth.js ou similar.
*   **Integração com Banco de Dados:** Substituir dados mockados por um banco de dados real (e.g., PostgreSQL com Neon, Supabase).
*   **Validação de Formulários:** Adicionar validação de formulário mais robusta.
*   **Sistema de Recuperação de Senha:** Implementar funcionalidade de "Esqueceu a senha?".
*   **Notificações:** Desenvolver um sistema de notificações para eventos importantes.
*   **Relatórios Avançados:** Adicionar gráficos interativos e relatórios de vendas mais detalhados.
*   **Sistema de Cupons:** Implementar um sistema de cupons para a loja.
*   **Integração de Pagamentos:** Finalizar a integração com gateways de pagamento.
*   **Deploy:** Configurar o deploy contínuo na Vercel.
