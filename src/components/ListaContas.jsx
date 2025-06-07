import { useState } from "react";
import { categorias } from "../data/categorias";
import CardConta from "./CardConta";
import ResumoFinanceiro from "./ResumoFinanceiro";

export default function ListaContas({
  contas,
  onTogglePago,
  onRemover,
  onEditar,
}) {
  const [contaEditando, setContaEditando] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [parcelas, setParcelas] = useState(1);

  const iniciarEdicao = (conta) => {
    setContaEditando(conta.id);
    setDescricao(conta.descricao);
    setValor(conta.valor);
    setVencimento(conta.vencimento || "");
    setParcelas(conta.parcelas || 1);
  };

  const salvarEdicao = () => {
    onEditar({
      ...contas.find((c) => c.id === contaEditando),
      descricao,
      valor: Number(valor),
      vencimento,
      parcelas: Number(parcelas),
    });
    setContaEditando(null);
    setDescricao("");
    setValor("");
    setVencimento("");
    setParcelas(1);
  };

  const cancelarEdicao = () => {
    setContaEditando(null);
    setDescricao("");
    setValor("");
    setVencimento("");
    setParcelas(1);
  };

  const totalPorCategoria = (cat) =>
    contas
      .filter((c) => c.categoria === cat)
      .reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <>
      {categorias.map((cat) => (
        <div key={cat} className="mb-4">
          <h2 className="text-xl font-semibold mb-2">{cat}</h2>
          <div className="space-y-2">
            {contas
              .filter((c) => c.categoria === cat)
              .map((conta) =>
                contaEditando === conta.id ? (
                  <div
                    key={conta.id}
                    className="bg-yellow-50 p-3 rounded flex flex-col gap-2"
                  >
                    <input
                      type="text"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      className="p-1 rounded border"
                    />
                    <input
                      type="number"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      className="p-1 rounded border"
                    />
                    <input
                      type="date"
                      value={vencimento}
                      onChange={(e) => setVencimento(e.target.value)}
                      className="p-1 rounded border"
                    />
                    <input
                      type="number"
                      min={1}
                      value={parcelas}
                      onChange={(e) => setParcelas(e.target.value)}
                      className="p-1 rounded border"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={salvarEdicao}
                        className="px-2 py-1 bg-green-600 text-white rounded"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelarEdicao}
                        className="px-2 py-1 bg-gray-400 text-white rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <CardConta
                    key={conta.id}
                    conta={conta}
                    onTogglePago={onTogglePago}
                    onRemover={onRemover}
                    onEditar={iniciarEdicao}
                  />
                )
              )}
          </div>
          <div className="text-right mt-2 font-semibold">
            Total: R$ {totalPorCategoria(cat).toFixed(2)}
          </div>
        </div>
      ))}
      <ResumoFinanceiro contas={contas} />
    </>
  );
}
