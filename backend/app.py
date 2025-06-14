from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Conta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(120), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    vencimento = db.Column(db.String(10))
    pago = db.Column(db.Boolean, default=False)
    mes = db.Column(db.Integer)
    ano = db.Column(db.Integer)

@app.route("/contas", methods=["GET"])
def get_contas():
    contas = Conta.query.all()
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

@app.route("/contas", methods=["POST"])
def add_conta():
    data = request.json
    conta = Conta(**data)
    db.session.add(conta)
    db.session.commit()
    return jsonify({"id": conta.id}), 201

@app.route("/contas/<int:id>", methods=["PUT"])
def update_conta(id):
    data = request.json
    conta = Conta.query.get_or_404(id)
    for key, value in data.items():
        setattr(conta, key, value)
    db.session.commit()
    return jsonify({"success": True})

@app.route("/contas/<int:id>", methods=["DELETE"])
def delete_conta(id):
    conta = Conta.query.get_or_404(id)
    db.session.delete(conta)
    db.session.commit()
    return jsonify({"success": True})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
