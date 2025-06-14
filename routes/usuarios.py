from flask import Blueprint, jsonify
from models import Usuario

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route("/usuarios/count", methods=["GET"])
def count_usuarios():
    count = Usuario.query.count()
    return jsonify({"count": count})

@usuarios_bp.route("/usuarios", methods=["GET"])
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([
        {"id": u.id, "username": u.username, "email": u.email}
        for u in usuarios
    ])