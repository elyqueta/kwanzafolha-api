# KwanzaFolha Cloud — Schema do Banco de Dados

Este pacote contém o novo schema PostgreSQL do **KwanzaFolha Cloud**, organizado
em módulos SQL executáveis em sequência, mais o `docker-compose.yml` para subir
o banco em Docker.

---

## Onde colocar esta pasta

Coloca o conteúdo deste zip **dentro da pasta raiz da tua API** (`kwanzafolha-api/`),
não na pasta geral do projeto (a que também tem o front, docs, etc).

Ou seja, depois de extraíres o zip, a estrutura deve ficar assim:

```
kwanzafolha-api/          <- raiz do backend (onde já está o package.json, src/, etc)
├── src/
├── db/                   <- ESTA pasta (extraída do zip)
│   ├── 000_run_all.sql
│   ├── 00_extensoes/
│   ├── 00_roles/
│   ├── 01_core/
│   ├── 02_referencia/    <- ainda vazio, próxima etapa
│   ├── 03_rh/            <- ainda vazio
│   ├── 04_payroll/       <- ainda vazio
│   └── 05_seeds/
├── docker-compose.yml    <- substitui o que já tens (só mudou o volume ./db:/db)
├── package.json
├── .env
└── ...
```

### Por que na pasta da API, e não na pasta geral do projeto?

O banco de dados é uma dependência de infraestrutura **do backend**, não do
projeto como um todo. Só a API (`kwanzafolha-api`) fala diretamente com o
Postgres — o frontend nunca acede à base de dados diretamente, só através da
API. Faz sentido, então, que o `docker-compose.yml` e os scripts de schema
vivam ao lado do código que os usa (`src/`), e não numa pasta "genérica" que
não tem uma relação de execução direta com eles.

Se um dia o projeto crescer para ter múltiplos serviços de backend (ex: um
serviço separado só para relatórios, outro para notificações), aí sim faria
sentido mover o `docker-compose.yml` para a raiz geral do projeto, orquestrando
vários containers. Por agora, com só uma API, mantém tudo junto dela.

---

## Passo a passo de instalacao

### 1. Extrai o zip dentro da pasta da API

```bash
cd ~/Documentos/projectos/Kwanza/kwanzafolha-api
unzip kwanzafolha-db.zip -d .
```

Se já tinhas um `docker-compose.yml` antigo, o do zip **substitui** o antigo
(só adiciona uma linha de volume a mais — ver seção abaixo).

### 2. Confirma que a porta 5432 não está ocupada por outro projeto

Como já tens outro projeto Docker a usar a porta `5432`, este `docker-compose.yml`
já vem configurado para expor o Postgres na porta **5433** (fora do container),
mantendo internamente a 5432. Não precisas de fazer nada extra aqui — já está
tratado.

Se quiseres confirmar mesmo assim que a 5433 está livre:

```bash
sudo lsof -i :5433
```

Não deve devolver nada.

### 3. Sobe o container

```bash
docker compose up -d
docker compose ps
```

Espera até o status aparecer como `healthy`.

### 4. Define a password do utilizador dedicado da API

Abre `db/00_roles/001_app_role.sql` e troca `TROCA_ESTA_PASSWORD_AQUI` por uma
password forte (podes gerar uma com `uuidgen` no terminal, por exemplo).

### 5. Gera o hash da tua password de admin

```bash
node -e "console.log(require('bcryptjs').hashSync('TUA_PASSWORD_AQUI', 10))"
```

Copia o resultado (algo como `$2a$10$...`) e cola em
`db/05_seeds/001_seed_admin.sql`, no lugar de `SUBSTITUI_PELO_HASH_GERADO`.

### 6. Executa o schema completo

Como o `docker-compose.yml` já monta a pasta `db/` dentro do container
(em `/db`), podes rodar tudo assim, de fora:

```bash
docker compose exec -T db psql -U postgres -d hr_system -f /db/000_run_all.sql
```

Deves ver as mensagens `>> A criar extensões...`, `>> A criar módulo CORE...`,
etc., terminando em `>> Schema CORE criado com sucesso.`

### 7. Atualiza o `.env` da API

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5433
DB_NAME=hr_system
DB_USER=kwanzafolha_app
DB_PASSWORD=<a mesma password que puseste no 001_app_role.sql>

JWT_SECRET=um-segredo-bem-comprido-e-aleatorio
```

Repara que `DB_USER` agora é `kwanzafolha_app` (utilizador dedicado, sem
superpoderes) — não `postgres`.

### 8. Testa

```bash
npm run dev
```

Deves ver: `Ligado ao PostgreSQL com sucesso`

Depois testa o login:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kwanzafolha.ao","password":"TUA_PASSWORD_AQUI"}'
```

Deves receber um `token` JWT de volta.

---

## O que ja esta incluido (modulo CORE)

- `utilizadores` — contas de acesso à plataforma
- `empresas` — empresas cadastradas (multi-tenant)
- `empresa_config_fiscal` — taxas de INSS e subsídios por empresa
- `empresa_contas_bancarias` — contas bancárias de cada empresa
- `utilizador_empresa` — liga utilizadores a empresas (many-to-many)

Todas as tabelas expostas na API (`empresas`, `utilizadores`,
`empresa_contas_bancarias`) têm uma coluna `uuid`, gerada automaticamente,
pensada para no futuro substituir o `id` sequencial nas rotas públicas —
sem abrir mão da performance do `BIGSERIAL` internamente (arquitetura híbrida).

## O que falta (pastas ja criadas, vazias)

- `02_referencia/` — províncias, municípios, bancos angolanos, moedas
- `03_rh/` — funcionários, departamentos, contratos, faltas, férias
- `04_payroll/` — rubricas, processamento salarial, tabela IRT

Estes módulos serão adicionados um de cada vez, sempre com o `000_run_all.sql`
atualizado para incluir os novos `\i`.

## Sobre o utilizador dedicado (`kwanzafolha_app`)

A API **nunca** deve ligar-se à base de dados como `postgres` (superuser).
O script `00_roles/001_app_role.sql` cria um utilizador `kwanzafolha_app` com
permissões apenas de `SELECT`, `INSERT`, `UPDATE`, `DELETE` nas tabelas — sem
poder para criar/apagar bases de dados ou outros utilizadores. Isto segue o
princípio do menor privilégio: se a API for comprometida, o estrago possível
fica limitado aos dados, nunca à infraestrutura do banco.

Usa `postgres` (superuser) apenas manualmente, para rodar migrações — nunca
no `.env` da aplicação.