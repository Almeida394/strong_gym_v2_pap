# Strong Gym — backend e frontend separados

Este projeto está dividido em duas partes independentes, que falam uma com a
outra através de pedidos HTTP (fetch):

```
strong_gym_v2/
├── backend/            → Python (Flask). Só devolve dados em JSON.
│   ├── app.py
│   └── requirements.txt
└── frontend/           → HTML + CSS + JavaScript puro. Não tem Python nenhum.
    ├── index.html, aulas.html, planos.html, myplan.html, login.html,
    │   registo.html, perfil.html, admin.html, admin-form.html, admin-inscritos.html
    ├── css/style.css
    └── js/
        ├── api.js        → funções partilhadas para falar com o backend
        ├── home.js, aulas.js, myplan.js, admin.js, admin-form.js
```

## Como funciona a separação

- O **backend** (`app.py`) só sabe responder a pedidos do tipo
  `GET /api/aulas`, `POST /api/login`, etc., e devolve sempre JSON. Não sabe
  nada sobre como a página vai ter aspeto.
- O **frontend** é um conjunto de páginas HTML normais, que correm no
  browser. Cada página tem um ficheiro `.js` próprio que usa `fetch()` para
  pedir dados ao backend e desenhá-los na página.
- Como não usamos cookies de sessão do Flask (o frontend corre numa porta
  diferente do backend), o login devolve um **token**: uma "senha
  temporária" que o frontend guarda no `localStorage` do browser e envia em
  cada pedido protegido, no cabeçalho `Authorization: Bearer <token>`.

## Como correr

**1. Liga o backend** (fica à escuta em `http://127.0.0.1:5000`):
```
cd backend
pip install -r requirements.txt
python app.py
```

**2. Liga o frontend** — como é só HTML/CSS/JS, não precisa de Python. A
forma mais simples é abrir um segundo terminal:
```
cd frontend
python -m http.server 5500
```
e depois abrir no browser: `http://127.0.0.1:5500`

(Podes também usar a extensão "Live Server" do VS Code em vez deste comando.)

**Importante:** tens de deixar os dois servidores ligados ao mesmo tempo —
o do backend (porta 5000) e o do frontend (porta 5500). Se fechares o do
backend, o site continua a abrir mas nenhum dado aparece, porque o `fetch`
deixa de encontrar a API.

## Conta de administrador de exemplo

- Email: `admin@stronggym.pt`
- Palavra-passe: `admin123`

## O que já está feito

- Página inicial (dados do ginásio, vindos da API)
- Lista de aulas com filtros (tipo, dia, instrutor)
- Registo e login com token (palavra-passe em hash, nunca em texto simples)
- Marcar e cancelar presença em aulas
- Perfil com histórico de aulas marcadas
- Planos/mensalidades
- MyPlan: sugestão de treino e estimativa nutricional por utilizador autenticado
- Painel de administrador: criar, editar, apagar aulas, ver inscritos
- Design responsivo

## Porque é que esta estrutura é "mais a sério"

Na v1 (a pasta `strong_gym`, se ainda a tiveres), o Flask gerava o HTML
diretamente (`render_template`) — backend e frontend estavam no mesmo
processo. Aqui estão completamente separados: podias publicar o backend
num servidor e o frontend noutro totalmente diferente (ou até sem servidor
nenhum, só ficheiros estáticos), e continuavam a falar um com o outro. É
assim que a maioria das aplicações web a sério funciona hoje em dia.
