from flask import Blueprint, request, jsonify, session
from models import db, Usuario
from utils.email_utils import gerar_senha_temporaria, enviar_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if Usuario.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Usuário já existe"}), 400
    if Usuario.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "E-mail já cadastrado"}), 400
    user = Usuario(username=data["username"], email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Usuário criado com sucesso!"})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = Usuario.query.filter_by(username=data["username"]).first()
    if user and user.check_password(data["password"]):
        session["user_id"] = user.id
        return jsonify({
            "message": "Login realizado com sucesso!",
            "user_id": user.id,
            "precisa_trocar_senha": user.precisa_trocar_senha
        })
    return jsonify({"error": "Usuário ou senha inválidos"}), 401

@auth_bp.route("/reset-senha", methods=["POST"])
def reset_senha():
    data = request.json
    email = data.get("email")
    user = Usuario.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "E-mail não cadastrado"}), 404
    senha_temp = gerar_senha_temporaria()
    user.set_password(senha_temp)
    user.precisa_trocar_senha = True
    db.session.commit()
    try:
        enviar_email(
            destinatario=email,
            assunto="Sua senha temporária",
            corpo=f"Sua nova senha temporária é: {senha_temp}"
        )
    except Exception as e:
        return jsonify({"error": "Erro ao enviar e-mail"}), 500
    return jsonify({"message": "Senha temporária enviada para o e-mail informado."})

@auth_bp.route("/trocar-senha", methods=["POST"])
def trocar_senha():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Não autenticado"}), 401
    data = request.json
    nova_senha = data.get("nova_senha")
    if not nova_senha or len(nova_senha) < 4:
        return jsonify({"error": "A nova senha deve ter pelo menos 4 caracteres."}), 400
    user = Usuario.query.get(user_id)
    user.set_password(nova_senha)
    user.precisa_trocar_senha = False
    db.session.commit()
    return jsonify({"message": "Senha alterada com sucesso!"})

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logout realizado com sucesso!"})

@auth_bp.route("/me", methods=["GET"])
def me():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"user_id": None})
    return jsonify({"user_id": user_id})