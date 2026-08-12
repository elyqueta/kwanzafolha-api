# kwanza_api

Backend do **KwanzaFolha Cloud** — sistema de gestão de Recursos Humanos e Folha de Salários (HR + Payroll) para o mercado angolano, incluindo cálculo de IRT e INSS em Kwanzas (AOA).

Este projeto é uma **reescrita completa**, em Node.js + TypeScript, do backend original (`erp-api`, em JavaScript puro). Os contratos de API (rotas, nomes de campos, formatos de resposta) foram preservados intencionalmente, para que o frontend React existente continue a funcionar sem alterações.

---

## 🧱 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 24 |
| Linguagem | TypeScript 6 (modo `strict`) |
| Framework HTTP | Express.js |
| Base de Dados | PostgreSQL (`hr_system`), via `pg` (Pool de ligações) |
| Autenticação | JWT (`jsonwebtoken`) + `bcryptjs` (hash de passwords) |
| Dev tools | `ts-node-dev`, `dotenv`, `cors` |
| Testes de API | Thunder Client (VS Code) |

---

## 📁 Estrutura do Projeto

```
src/
├── controllers/     # Lógica de cada operação (recebe pedido, fala com a BD, devolve resposta)
├── db/
│   └── pool.ts       # Pool de ligação ao PostgreSQL
├── middlewares/
│   ├── auth.middleware.ts           # Valida o token JWT
│   ├── role.middleware.ts           # Autorização por papel (role)
│   └── empresa-acesso.middleware.ts # Confirma se o utilizador pertence à empresa pedida
├── routes/          # Definição dos caminhos HTTP
├── types/           # Interfaces TypeScript (contratos de dados por módulo)
├── utils/
│   └── jwt.util.ts   # Geração e verificação de tokens JWT
└── server.ts         # Ponto de entrada da aplicação
```

---

## ⚙️ Configuração e Arranque

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Criar um ficheiro `.env` na raiz do projeto:
   ```env
   PORT=3001

   DB_HOST=localhost
   DB_PORT=5434
   DB_NAME=hr_system
   DB_USER=postgres
   DB_PASSWORD=a_tua_password

   JWT_SECRET=um-segredo-bem-comprido-e-aleatorio
   ```

3. Correr em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Confirmar que está tudo ligado:
   ```bash
   curl http://localhost:3001/health
   ```

> O backend antigo (`erp-api`, JS) corre na porta `3000`. Este novo backend corre deliberadamente na `3001`, para permitir correr os dois em paralelo durante a transição.

---

## 🗄️ Alterações ao Esquema da Base de Dados

O schema original tinha uma duplicação: tanto `funcionarios` como `funcionario_profissional` guardavam `departamento_id`, `funcao_id` e `categoria_id`. Foi decidido:

- `funcionarios` → passa a conter **apenas dados pessoais** (identidade do colaborador).
- `funcionario_profissional` → passa a ser a **única fonte de verdade** para o vínculo profissional (departamento, função, categoria, salário), funcionando como uma tabela de **histórico** — cada mudança de cargo/salário cria uma nova linha, em vez de sobrescrever a anterior.

Migrações aplicadas:

```sql
-- Flag para identificar o vínculo profissional em vigor
ALTER TABLE funcionario_profissional ADD COLUMN IF NOT EXISTS atual BOOLEAN DEFAULT TRUE;

-- Garante que existe no máximo um registo "atual" por funcionário
CREATE UNIQUE INDEX IF NOT EXISTS idx_func_prof_atual_unico
  ON funcionario_profissional (funcionario_id)
  WHERE atual = TRUE;

-- Remove a duplicação em funcionarios
ALTER TABLE funcionarios DROP COLUMN IF EXISTS departamento_id;
ALTER TABLE funcionarios DROP COLUMN IF EXISTS funcao_id;
ALTER TABLE funcionarios DROP COLUMN IF EXISTS categoria_id;

-- Permite operações de upsert na configuração fiscal por empresa
ALTER TABLE empresa_config_fiscal ADD CONSTRAINT uq_empresa_config_fiscal_empresa UNIQUE (empresa_id);
```

---

## 📡 Endpoints Implementados

### Autenticação — Concluído e testado

| Método | Rota | Proteção | Descrição |
|---|---|---|---|
| `POST` | `/api/auth/login` | Pública | Valida credenciais, devolve `{ token, user }` |
| `GET` | `/api/auth/empresas` | JWT | Lista as empresas do utilizador autenticado |

### Empresas — 🟡 Implementado, em fase de testes

| Método | Rota | Proteção | Descrição |
|---|---|---|---|
| `GET` | `/api/empresas` | JWT + `SUPER_ADMIN` | Lista todas as empresas |
| `GET` | `/api/empresas/:id` | JWT + acesso à empresa | Detalhe de uma empresa |
| `POST` | `/api/empresas` | JWT + `SUPER_ADMIN` | Cria uma nova empresa |
| `PUT` | `/api/empresas/:id` | JWT + acesso + `SUPER_ADMIN`/`ADMIN` | Edita uma empresa |
| `GET` | `/api/empresas/:id/fiscal` | JWT + acesso à empresa | Obtém configuração fiscal (INSS, subsídios) |
| `PUT` | `/api/empresas/:id/fiscal` | JWT + acesso + `SUPER_ADMIN`/`ADMIN` | Atualiza configuração fiscal (upsert) |
| `GET` | `/api/empresas/:id/contas-bancarias` | JWT + acesso à empresa | Lista contas bancárias |
| `POST` | `/api/empresas/:id/contas-bancarias` | JWT + acesso + `SUPER_ADMIN`/`ADMIN` | Cria conta bancária |

**Camadas de proteção usadas:**
- **Autenticação** (`autenticar`) — confirma que o pedido tem um token JWT válido.
- **Autorização por papel** (`permitirRoles(...roles)`) — confirma que o papel do utilizador (`SUPER_ADMIN`, `ADMIN`, etc.) permite a ação.
- **Acesso à empresa** (`verificarAcessoEmpresa`) — confirma que o utilizador está ligado àquela empresa específica (tabela `utilizador_empresa`), exceto `SUPER_ADMIN`, que vê tudo.

---

## 🗺️ Próximos Módulos (por ordem)

- [ ] Departamentos, Funções e Categorias
- [ ] Funcionários (incluindo histórico em `funcionario_profissional`)
- [ ] Contratos
- [ ] Faltas e Férias
- [ ] Processamento Salarial (cálculo de IRT e INSS)

Após a conclusão da API, está planeada a migração do frontend de **Vite + React** para **Next.js em TypeScript**.