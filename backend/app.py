"""
Strong Gym - Backend (API)
---------------------------
Este ficheiro é SÓ o backend: não devolve HTML, só JSON.
O frontend (pasta ../frontend) é um site separado, feito em HTML/CSS/JS,
que vai buscar e enviar dados a esta API usando `fetch`.

Autenticação: como o frontend corre numa origem diferente (outra porta),
não usamos cookies de sessão do Flask. Em vez disso, o login devolve um
"token" (uma espécie de senha temporária), que o frontend guarda e envia
em cada pedido protegido, no cabeçalho "Authorization: Bearer <token>".

Para correr:
    pip install -r requirements.txt
    python app.py
A API fica disponível em http://127.0.0.1:5000/api/...
"""

import sqlite3
import secrets
from functools import wraps
from datetime import datetime

from flask import Flask, request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
DATABASE = "gym.db"

GINASIO = {
    "nome": "Strong Gym",
    "morada": "Rua das Oliveiras, 123, Lisboa",
    "contacto": "geral@stronggym.pt · 21 000 0000",
    "horarios": "Seg a Sex: 07:00 - 22:00 · Sáb: 09:00 - 14:00 · Dom: Fechado",
    "modalidades": ["Musculação", "Treino Funcional", "Spinning", "Yoga", "Crossfit"],
}


# ---------------------------------------------------------------------------
# CORS: permitir que o frontend (noutra porta/origem) chame esta API
# ---------------------------------------------------------------------------

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response


@app.before_request
def handle_preflight():
    # O browser envia um pedido OPTIONS antes de pedidos "a sério" (preflight).
    # Respondemos logo que sim, sem precisar de lógica própria.
    if request.method == "OPTIONS":
        return app.make_default_options_response()


# ---------------------------------------------------------------------------
# Base de dados
# ---------------------------------------------------------------------------

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = sqlite3.connect(DATABASE)
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS planos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            descricao TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin INTEGER NOT NULL DEFAULT 0,
            plano_id INTEGER,
            FOREIGN KEY (plano_id) REFERENCES planos (id)
        );

        CREATE TABLE IF NOT EXISTS aulas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            tipo TEXT NOT NULL,
            instrutor TEXT NOT NULL,
            sala TEXT NOT NULL,
            dia_semana TEXT NOT NULL,
            horario TEXT NOT NULL,
            vagas_totais INTEGER NOT NULL,
            vagas_disponiveis INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS marcacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            aula_id INTEGER NOT NULL,
            data_marcacao TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (aula_id) REFERENCES aulas (id)
        );

        CREATE TABLE IF NOT EXISTS sessoes (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            criado_em TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );
        """
    )

    aulas_existentes = db.execute("SELECT COUNT(*) FROM aulas").fetchone()[0]
    if aulas_existentes == 0:
        db.executescript(
            """
            INSERT INTO planos (nome, preco, descricao) VALUES
                ('Mensal', 35.0, 'Acesso total, renovação mensal'),
                ('Anual', 350.0, 'Acesso total, 2 meses grátis'),
                ('Só Musculação', 25.0, 'Apenas sala de musculação livre');

            INSERT INTO aulas (nome, tipo, instrutor, sala, dia_semana, horario, vagas_totais, vagas_disponiveis) VALUES
                ('Treino Funcional', 'Funcional', 'Marco Silva', 'Sala 2', 'Segunda', '18:30', 15, 15),
                ('Spinning', 'Cardio', 'Ana Costa', 'Sala 1', 'Terça', '19:30', 12, 3),
                ('Yoga', 'Bem-estar', 'Sofia Ramos', 'Sala 2', 'Quarta', '20:30', 10, 0),
                ('Crossfit', 'Funcional', 'Marco Silva', 'Sala 3', 'Quinta', '18:00', 10, 6),
                ('Musculação Livre', 'Musculação', 'Sem instrutor fixo', 'Sala Principal', 'Todos os dias', '07:00 - 22:00', 999, 999);
            """
        )
        db.execute(
            "INSERT INTO users (nome, email, password_hash, is_admin) VALUES (?, ?, ?, 1)",
            ("Administrador", "admin@stronggym.pt", generate_password_hash("admin123")),
        )
        db.commit()

    db.close()


# ---------------------------------------------------------------------------
# Autenticação por token
# ---------------------------------------------------------------------------

def get_user_from_token():
    """Lê o cabeçalho Authorization e devolve o utilizador correspondente, ou None."""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth[len("Bearer "):]

    db = get_db()
    row = db.execute(
        """SELECT users.* FROM sessoes
           JOIN users ON users.id = sessoes.user_id
           WHERE sessoes.token = ?""",
        (token,),
    ).fetchone()
    return row


def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = get_user_from_token()
        if user is None:
            return jsonify({"erro": "Precisas de iniciar sessão."}), 401
        g.user = user
        return f(*args, **kwargs)
    return wrapper


def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = get_user_from_token()
        if user is None:
            return jsonify({"erro": "Precisas de iniciar sessão."}), 401
        if not user["is_admin"]:
            return jsonify({"erro": "Só administradores podem fazer isto."}), 403
        g.user = user
        return f(*args, **kwargs)
    return wrapper


# ---------------------------------------------------------------------------
# Ginásio
# ---------------------------------------------------------------------------

@app.route("/api/ginasio")
def api_ginasio():
    return jsonify(GINASIO)


# ---------------------------------------------------------------------------
# Aulas
# ---------------------------------------------------------------------------

@app.route("/api/aulas")
def api_aulas():
    db = get_db()

    tipo = request.args.get("tipo", "")
    dia = request.args.get("dia", "")
    instrutor = request.args.get("instrutor", "")

    query = "SELECT * FROM aulas WHERE 1=1"
    params = []
    if tipo:
        query += " AND tipo = ?"
        params.append(tipo)
    if dia:
        query += " AND dia_semana = ?"
        params.append(dia)
    if instrutor:
        query += " AND instrutor = ?"
        params.append(instrutor)
    query += " ORDER BY dia_semana, horario"

    aulas = [dict(r) for r in db.execute(query, params).fetchall()]

    # Marca quais aulas o utilizador atual já tem marcadas (se estiver autenticado)
    user = get_user_from_token()
    marcadas = set()
    if user:
        rows = db.execute("SELECT aula_id FROM marcacoes WHERE user_id = ?", (user["id"],)).fetchall()
        marcadas = {r["aula_id"] for r in rows}
    for a in aulas:
        a["marcada"] = a["id"] in marcadas

    filtros = {
        "tipos": [r["tipo"] for r in db.execute("SELECT DISTINCT tipo FROM aulas ORDER BY tipo")],
        "dias": [r["dia_semana"] for r in db.execute("SELECT DISTINCT dia_semana FROM aulas")],
        "instrutores": [r["instrutor"] for r in db.execute("SELECT DISTINCT instrutor FROM aulas ORDER BY instrutor")],
    }

    return jsonify({"aulas": aulas, "filtros": filtros})


@app.route("/api/aulas/<int:aula_id>/marcar", methods=["POST"])
@token_required
def api_marcar_aula(aula_id):
    db = get_db()
    aula = db.execute("SELECT * FROM aulas WHERE id = ?", (aula_id,)).fetchone()
    if aula is None:
        return jsonify({"erro": "Essa aula não existe."}), 404

    ja_marcada = db.execute(
        "SELECT 1 FROM marcacoes WHERE user_id = ? AND aula_id = ?", (g.user["id"], aula_id)
    ).fetchone()
    if ja_marcada:
        return jsonify({"erro": "Já estás inscrito nessa aula."}), 400
    if aula["vagas_disponiveis"] <= 0:
        return jsonify({"erro": "Essa aula já não tem vagas."}), 400

    db.execute(
        "INSERT INTO marcacoes (user_id, aula_id, data_marcacao) VALUES (?, ?, ?)",
        (g.user["id"], aula_id, datetime.now().strftime("%Y-%m-%d %H:%M")),
    )
    db.execute("UPDATE aulas SET vagas_disponiveis = vagas_disponiveis - 1 WHERE id = ?", (aula_id,))
    db.commit()
    return jsonify({"mensagem": f"Inscrição confirmada em '{aula['nome']}'."})


@app.route("/api/aulas/<int:aula_id>/cancelar", methods=["POST"])
@token_required
def api_cancelar_aula(aula_id):
    db = get_db()
    marcacao = db.execute(
        "SELECT * FROM marcacoes WHERE user_id = ? AND aula_id = ?", (g.user["id"], aula_id)
    ).fetchone()
    if marcacao is None:
        return jsonify({"erro": "Não tens essa aula marcada."}), 400

    db.execute("DELETE FROM marcacoes WHERE id = ?", (marcacao["id"],))
    db.execute("UPDATE aulas SET vagas_disponiveis = vagas_disponiveis + 1 WHERE id = ?", (aula_id,))
    db.commit()
    return jsonify({"mensagem": "Marcação cancelada."})


# ---------------------------------------------------------------------------
# Planos
# ---------------------------------------------------------------------------

@app.route("/api/planos")
def api_planos():
    db = get_db()
    planos = [dict(r) for r in db.execute("SELECT * FROM planos").fetchall()]
    return jsonify(planos)


# ---------------------------------------------------------------------------
# Registo, login, logout
# ---------------------------------------------------------------------------

@app.route("/api/registo", methods=["POST"])
def api_registo():
    dados = request.get_json(force=True)
    nome = (dados.get("nome") or "").strip()
    email = (dados.get("email") or "").strip().lower()
    password = dados.get("password") or ""
    plano_id = dados.get("plano_id") or None

    if not nome or not email or not password:
        return jsonify({"erro": "Preenche todos os campos."}), 400

    db = get_db()
    existe = db.execute("SELECT 1 FROM users WHERE email = ?", (email,)).fetchone()
    if existe:
        return jsonify({"erro": "Já existe uma conta com esse email."}), 400

    db.execute(
        "INSERT INTO users (nome, email, password_hash, plano_id) VALUES (?, ?, ?, ?)",
        (nome, email, generate_password_hash(password), plano_id),
    )
    db.commit()
    return jsonify({"mensagem": "Conta criada com sucesso."})


@app.route("/api/login", methods=["POST"])
def api_login():
    dados = request.get_json(force=True)
    email = (dados.get("email") or "").strip().lower()
    password = dados.get("password") or ""

    db = get_db()
    user = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if user is None or not check_password_hash(user["password_hash"], password):
        return jsonify({"erro": "Email ou palavra-passe incorretos."}), 401

    token = secrets.token_hex(24)
    db.execute(
        "INSERT INTO sessoes (token, user_id, criado_em) VALUES (?, ?, ?)",
        (token, user["id"], datetime.now().strftime("%Y-%m-%d %H:%M")),
    )
    db.commit()

    return jsonify({
        "token": token,
        "nome": user["nome"],
        "is_admin": bool(user["is_admin"]),
    })


@app.route("/api/logout", methods=["POST"])
@token_required
def api_logout():
    db = get_db()
    auth = request.headers.get("Authorization", "")
    token = auth[len("Bearer "):]
    db.execute("DELETE FROM sessoes WHERE token = ?", (token,))
    db.commit()
    return jsonify({"mensagem": "Sessão terminada."})


# ---------------------------------------------------------------------------
# Perfil
# ---------------------------------------------------------------------------

@app.route("/api/perfil")
@token_required
def api_perfil():
    db = get_db()
    user = g.user
    plano = None
    if user["plano_id"]:
        plano = dict(db.execute("SELECT * FROM planos WHERE id = ?", (user["plano_id"],)).fetchone())

    historico = [dict(r) for r in db.execute(
        """SELECT aulas.nome, aulas.dia_semana, aulas.horario, marcacoes.data_marcacao
           FROM marcacoes JOIN aulas ON aulas.id = marcacoes.aula_id
           WHERE marcacoes.user_id = ? ORDER BY marcacoes.data_marcacao DESC""",
        (user["id"],),
    ).fetchall()]

    return jsonify({
        "nome": user["nome"],
        "email": user["email"],
        "plano": plano,
        "historico": historico,
    })


# ---------------------------------------------------------------------------
# MyPlan
# ---------------------------------------------------------------------------

@app.route("/api/myplan", methods=["POST"])
@token_required
def api_myplan():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({"erro": "Envia os dados do plano em formato JSON."}), 400

    altura = dados.get("altura")
    peso = dados.get("peso")
    objetivo = dados.get("objetivo")
    dias = dados.get("dias")

    if (isinstance(altura, bool) or not isinstance(altura, (int, float))
            or not 100 <= altura <= 250):
        return jsonify({"erro": "A altura deve estar entre 100 e 250 cm."}), 400
    if (isinstance(peso, bool) or not isinstance(peso, (int, float))
            or not 30 <= peso <= 300):
        return jsonify({"erro": "O peso deve estar entre 30 e 300 kg."}), 400
    if isinstance(dias, bool) or not isinstance(dias, int) or not 1 <= dias <= 6:
        return jsonify({"erro": "Escolhe entre 1 e 6 dias de treino por semana."}), 400

    treinos_por_objetivo = {
        "perder_peso": [
            "Corpo inteiro + cardio",
            "Força total + intervalos",
            "Corpo inteiro + cardio leve",
            "Inferiores + core",
            "Superiores + cardio",
            "Circuito de corpo inteiro",
        ],
        "manter_forma": [
            "Corpo inteiro",
            "Superiores",
            "Inferiores",
            "Corpo inteiro + core",
            "Superiores + condicionamento",
            "Inferiores + mobilidade",
        ],
        "ganhar_massa_muscular": [
            "Peito e tríceps",
            "Costas e bíceps",
            "Pernas e ombros",
            "Peito e costas",
            "Braços e ombros",
            "Pernas e core",
        ],
    }
    if not isinstance(objetivo, str) or objetivo not in treinos_por_objetivo:
        return jsonify({"erro": "Escolhe um objetivo válido."}), 400

    dias_semana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    treino = [
        {"dia": dias_semana[indice], "tipo": tipo}
        for indice, tipo in enumerate(treinos_por_objetivo[objetivo][:dias])
    ]

    # Estimativa inspirada na equação de Mifflin-St Jeor: como não pedimos
    # idade nem sexo, usa 30 anos e uma constante neutra (-78) como referência.
    metabolismo_repouso = 10 * peso + 6.25 * altura - 5 * 30 - 78
    # A atividade aumenta com os dias de treino; o objetivo ajusta as calorias.
    fator_atividade = 1.2 + dias * 0.075
    ajuste_objetivo = {
        "perder_peso": -300,
        "manter_forma": 0,
        "ganhar_massa_muscular": 250,
    }
    calorias = round(metabolismo_repouso * fator_atividade + ajuste_objetivo[objetivo])
    proteina_por_kg = {
        "perder_peso": 1.8,
        "manter_forma": 1.6,
        "ganhar_massa_muscular": 2.0,
    }
    proteina = round(peso * proteina_por_kg[objetivo])

    return jsonify({
        "treino": treino,
        "nutricao": {
            "calorias_diarias": calorias,
            "proteina_diaria_g": proteina,
        },
        "nota": "Estimativa simplificada; as necessidades individuais podem variar.",
    })


# ---------------------------------------------------------------------------
# Admin
# ---------------------------------------------------------------------------

@app.route("/api/admin/aulas", methods=["GET", "POST"])
@admin_required
def api_admin_aulas():
    db = get_db()

    if request.method == "POST":
        dados = request.get_json(force=True)
        vagas = int(dados["vagas_totais"])
        db.execute(
            """INSERT INTO aulas (nome, tipo, instrutor, sala, dia_semana, horario, vagas_totais, vagas_disponiveis)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (dados["nome"], dados["tipo"], dados["instrutor"], dados["sala"],
             dados["dia_semana"], dados["horario"], vagas, vagas),
        )
        db.commit()
        return jsonify({"mensagem": "Aula criada."})

    aulas = [dict(r) for r in db.execute("SELECT * FROM aulas ORDER BY dia_semana, horario").fetchall()]
    return jsonify(aulas)


@app.route("/api/admin/aulas/<int:aula_id>", methods=["GET", "PUT", "DELETE"])
@admin_required
def api_admin_aula_detalhe(aula_id):
    db = get_db()
    aula = db.execute("SELECT * FROM aulas WHERE id = ?", (aula_id,)).fetchone()
    if aula is None:
        return jsonify({"erro": "Aula não encontrada."}), 404

    if request.method == "GET":
        return jsonify(dict(aula))

    if request.method == "PUT":
        dados = request.get_json(force=True)
        ocupadas = aula["vagas_totais"] - aula["vagas_disponiveis"]
        novas_totais = int(dados["vagas_totais"])
        db.execute(
            """UPDATE aulas SET nome=?, tipo=?, instrutor=?, sala=?, dia_semana=?, horario=?,
               vagas_totais=?, vagas_disponiveis=? WHERE id=?""",
            (dados["nome"], dados["tipo"], dados["instrutor"], dados["sala"],
             dados["dia_semana"], dados["horario"], novas_totais,
             max(novas_totais - ocupadas, 0), aula_id),
        )
        db.commit()
        return jsonify({"mensagem": "Aula atualizada."})

    # DELETE
    db.execute("DELETE FROM marcacoes WHERE aula_id = ?", (aula_id,))
    db.execute("DELETE FROM aulas WHERE id = ?", (aula_id,))
    db.commit()
    return jsonify({"mensagem": "Aula apagada."})


@app.route("/api/admin/aulas/<int:aula_id>/inscritos")
@admin_required
def api_admin_inscritos(aula_id):
    db = get_db()
    aula = db.execute("SELECT * FROM aulas WHERE id = ?", (aula_id,)).fetchone()
    if aula is None:
        return jsonify({"erro": "Aula não encontrada."}), 404

    inscritos = [dict(r) for r in db.execute(
        """SELECT users.nome, users.email, marcacoes.data_marcacao
           FROM marcacoes JOIN users ON users.id = marcacoes.user_id
           WHERE marcacoes.aula_id = ?""",
        (aula_id,),
    ).fetchall()]

    return jsonify({"aula": dict(aula), "inscritos": inscritos})


# ---------------------------------------------------------------------------
# Arranque
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
