# Quartzo 2026 – Sistema de Logística

App web para gerenciar logística de artistas do Festival Quartzo 2026 (Fazenda Água Fria, Alto Paraíso de Goiás – 03 a 06/06/2026).

---

## Deploy no Netlify

### Opção A — GitHub + Netlify (recomendado, suporta atualizações automáticas)

1. **Crie um repositório no GitHub**
   - Acesse github.com → New repository
   - Nome sugerido: `quartzo-2026-logistics`
   - Privado ou público (sua escolha)

2. **Suba os arquivos**
   ```bash
   cd quartzo-2026
   git init
   git add .
   git commit -m "feat: quartzo 2026 logistics app"
   git remote add origin https://github.com/SEU_USUARIO/quartzo-2026-logistics.git
   git push -u origin main
   ```

3. **Conecte ao Netlify**
   - Acesse app.netlify.com → "Add new site" → "Import an existing project"
   - Escolha GitHub → selecione o repositório
   - As configurações de build são detectadas automaticamente via `netlify.toml`:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Clique em **Deploy site**

4. **Configure a variável de ambiente (chatbot IA)**
   - No painel do Netlify: Site settings → Environment variables
   - Adicione: `ANTHROPIC_API_KEY` = `sk-ant-api03-...` (sua chave Anthropic)
   - Redeploy o site para ativar

---

### Opção B — Deploy manual via drag-and-drop

1. **Instale dependências e faça o build local**
   ```bash
   cd quartzo-2026
   npm install
   npm run build
   ```

2. **Arraste a pasta `dist/` para o Netlify**
   - Acesse app.netlify.com → "Add new site" → "Deploy manually"
   - Arraste a pasta `dist/` gerada

3. **Configure `ANTHROPIC_API_KEY`** (igual ao passo 4 acima)

> ⚠️ No modo manual (drag-and-drop), a serverless function do chatbot IA **não funciona** — ela requer a Opção A (repositório Git conectado ao Netlify) para que o Netlify compile as Functions automaticamente.

---

## Desenvolvimento local

```bash
npm install
npm run dev
# Acesse: http://localhost:5173
```

Para testar a função do chatbot localmente:
```bash
npm install -g netlify-cli
netlify dev
# Acesse: http://localhost:8888
```

---

## Credenciais padrão

| Usuário | Email | Senha | Acesso |
|---------|-------|-------|--------|
| Admin   | admin@quartzo.com | admin123 | Total (edição) |
| Viewer  | view@quartzo.com  | view123  | Somente leitura |

---

## Estrutura do projeto

```
quartzo-2026/
├── netlify/
│   └── functions/
│       └── claude.js          ← Proxy seguro para API Anthropic
├── src/
│   ├── components/
│   │   ├── AI/Chatbot.jsx
│   │   ├── Artists/ArtistCard.jsx
│   │   ├── Artists/ArtistModal.jsx
│   │   ├── Layout/Sidebar.jsx
│   │   ├── Layout/Header.jsx
│   │   └── UI/Modal.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Artists.jsx
│   │   ├── Flights.jsx
│   │   ├── Transfers.jsx
│   │   ├── Hotels.jsx
│   │   ├── TimeTable.jsx
│   │   ├── Drivers.jsx
│   │   └── Settings.jsx
│   ├── store/index.js          ← Zustand (persist localStorage)
│   ├── data/seed.js            ← Dados iniciais
│   ├── utils/
│   │   ├── alertEngine.js
│   │   ├── dateUtils.js
│   │   ├── excelParser.js
│   │   └── excelExporter.js
│   └── i18n/index.js           ← PT/EN
├── netlify.toml
├── vite.config.js
└── package.json
```

---

## Funcionalidades

- **Artistas**: cards com modal detalhado, checks sequenciais, ocorrências, WhatsApp
- **Alertas**: engine automático (vermelho <2h margem, amarelo <3h)
- **Voos**: tabela filtrável com indicadores de alerta de timing
- **Traslados**: aeroporto (BSB) e internos (hotel↔evento)
- **Hospedagem**: grade por hotel (BAGUA, CAMINHO CACHOEIRA, BAMBU BRASIL)
- **Time Table**: grade visual por palco e dia
- **Motoristas**: CRUD completo com WhatsApp
- **Import/Export Excel**: importa planilhas existentes, exporta com marcadores `[*]`
- **Chatbot IA**: assistente com contexto completo do festival
- **PT/EN**: interface bilíngue
- **Dois níveis de acesso**: admin (edição) / readonly (visualização)
