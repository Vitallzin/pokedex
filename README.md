# Pokedex

Aplicacao web criada como projeto academico para consultar, comparar, favoritar e organizar Pokemon em times. O projeto usa React, TypeScript, Vite, Firebase e dados publicos da [PokeAPI](https://pokeapi.co/).

## Funcionalidades

- Listagem de Pokemon da Pokedex Nacional, com carregamento progressivo.
- Busca por nome ou numero.
- Filtros por tipo, geracao e favoritos.
- Ordenacao por numero, nome, altura, peso e experiencia base.
- Pagina de detalhes com informacoes, estatisticas, tipos, fraquezas, evolucoes e Pokemon similares.
- Comparacao entre dois Pokemon com estatisticas base, tipos e analise de vantagem.
- Autenticacao com e-mail/senha e login com Google.
- Confirmacao de e-mail para contas criadas com senha.
- Recuperacao e alteracao de senha.
- Favoritos salvos por usuario.
- Criacao de times personalizados.
- Tema claro/escuro.
- Layout responsivo para desktop e mobile.

## Tecnologias

- React 19
- TypeScript
- Vite
- React Router
- Firebase Authentication
- Cloud Firestore
- Axios
- Framer Motion
- Lucide React
- ESLint

## Requisitos

- Node.js instalado.
- npm instalado.
- Projeto Firebase configurado, caso queira usar login, favoritos e times.

## Como Rodar Localmente

1. Clone o repositorio:

```bash
git clone <url-do-repositorio>
cd pokedex
```

2. Instale as dependencias:

```bash
npm install
```

3. Copie o arquivo de exemplo de variaveis de ambiente:

```bash
cp .env.example .env.local
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

4. Preencha o arquivo `.env.local` com as credenciais do app web do Firebase.

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

6. Acesse a URL exibida no terminal, normalmente:

```text
http://localhost:5173
```

## Variaveis de Ambiente

O projeto espera as seguintes variaveis:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Esses valores ficam disponiveis no Firebase Console em:

```text
Project settings > General > Your apps
```

## Configuracao do Firebase

Para usar todos os recursos do app, configure um projeto Firebase com Authentication e Firestore.

### Authentication

Ative os provedores:

- Email/Password
- Google

Tambem adicione os dominios local e de producao em:

```text
Authentication > Settings > Authorized domains
```

### Firestore

O app usa a colecao `users`, com um documento por usuario autenticado. O id do documento e o UID gerado pelo Firebase Authentication.

Estrutura principal:

```text
users/{uid}
users/{uid}/favorites/current
users/{uid}/teams/current
```

Os detalhes do modelo estao em [firebase-schema.md](./firebase-schema.md).

As regras de seguranca estao em [firestore.rules](./firestore.rules). Elas limitam leitura e escrita ao proprio usuario autenticado.

## Limites do App

- Favoritos: ate 100 Pokemon por usuario.
- Times: ate 10 times por usuario.
- Pokemon por time: ate 6 Pokemon.
- Listagem nacional: Pokemon com id de 1 a 1025.

## Scripts Disponiveis

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run build
```

Gera a versao de producao em `dist`.

```bash
npm run preview
```

Serve localmente o build de producao.

```bash
npm run lint
```

Executa a verificacao de lint do projeto.

## Estrutura do Projeto

```text
src/
  assets/          Imagens usadas pela interface
  components/      Componentes reutilizaveis
  contexts/        Contextos globais de autenticacao, favoritos, times e tema
  data/            Dados auxiliares, como tipos e vantagens
  hooks/           Hooks customizados
  pages/           Paginas principais da aplicacao
  routes/          Rotas publicas e privadas
  services/        Integracoes com Firebase e PokeAPI
  styles/          Estilos globais, variaveis e temas
  types/           Tipagens do dominio Pokemon
  utils/           Funcoes auxiliares
```

## Rotas

| Rota | Descricao | Acesso |
| --- | --- | --- |
| `/` | Pokedex com busca, filtros e listagem | Publico |
| `/pokemon/:id` | Detalhes de um Pokemon | Publico |
| `/comparison` | Comparacao entre dois Pokemon | Publico |
| `/login` | Login e cadastro | Publico |
| `/favorites` | Pokemon favoritos | Privado |
| `/teams` | Times do usuario | Privado |
| `/settings` | Configuracoes do app | Publico |
| `/account/password` | Alteracao/recuperacao de senha | Privado |
| `/about` | Informacoes sobre o projeto | Publico |

## Fonte dos Dados

As informacoes de Pokemon, tipos, estatisticas, sprites, especies e cadeias de evolucao sao obtidas pela [PokeAPI](https://pokeapi.co/).

## Build e Deploy

Para gerar os arquivos finais:

```bash
npm run build
```

O resultado fica em `dist/`. Esse diretorio pode ser publicado em servicos de hospedagem para apps estaticos, como Firebase Hosting, Vercel, Netlify ou GitHub Pages.

Antes de publicar, configure as variaveis de ambiente no provedor escolhido e garanta que o dominio de producao esteja autorizado no Firebase Authentication.

## Observacao

Este projeto e academico e nao possui vinculo oficial com Nintendo, Game Freak, The Pokemon Company ou PokeAPI.
