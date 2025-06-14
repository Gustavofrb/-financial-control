from flask import Blueprint, request, jsonify, session
from models import db, Conta

contas_bp = Blueprint('contas', __name__)

@contas_bp.route("/contas", methods=["GET"])
def get_contas():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify([])
    contas = Conta.query.filter_by(usuario_id=user_id).all()
    return jsonify([{
        "id": c.id,
        "descricao": c.descricao,
        "valor": c.valor,
        "categoria": c.categoria,
        "vencimento": c.vencimento,
        "pago": c.pago,
        "mes": c.mes,
        "ano": c.ano
    } for c in contas])

@contas_bp.route("/contas", methods=["POST"])
def add_conta():
    data = request.json
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Não autenticado"}), 401
    conta = Conta(**data, usuario_id=user_id)
    db.session.add(conta)
    db.session.commit()
    return jsonify({"id": conta.id}), 201

@contas_bp.route("/contas/<int:id>", methods=["PUT"])
def update_conta(id):
    data = request.json
    conta = Conta.query.get_or_404(id)
    for key, value in data.items():
        setattr(conta, key, value)
    db.session.commit()
    return jsonify({"success": True})

@contas_bp.route("/contas/<int:id>", methods=["DELETE"])
def delete_conta(id):
    conta = Conta.query.get_or_404(id)
    db.session.delete(conta)
    db.session.commit()
    return jsonify({"success": True})