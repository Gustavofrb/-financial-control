import { useState } from "react";
import { categorias } from "../data/categorias";

export default function FormularioConta({ onAdicionar }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState(categorias[0]);
  const [vencimento, setVencimento] = useState("");
  const [parcelas, setParcelas] = useState(1);

  const handleAdicionar = () => {
    const valorNum = parseFloat(valor.replace(",", "."));
    if (!descricao || !valorNum || !categoria) return;
    onAdicionar({ descricao, valor: valorNum, categoria, vencimento, parcelas });
    setDescricao("");
    setValor("");
    setVencimento("");
    setParcelas(1);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="p-2 rounded border"
      />
      <input
        type="text"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="p-2 rounded border"
      />
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="p-2 rounded border"
      >
        {categorias.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>
      <input
        type="date"
        value={vencimento}
        onChange={(e) => setVencimento(e.target.value)}
        className="p-2 rounded border"
      />
      <input
        type="number"
        min={1}
        value={parcelas}
        onChange={(e) => setParcelas(parseInt(e.target.value))}
        className="p-2 rounded border"
        placeholder="Parcelas"
      />
      <button
        onClick={handleAdicionar}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Adicionar Conta
      </button>
    </div>
  );
}
