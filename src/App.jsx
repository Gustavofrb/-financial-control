import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Corrija este import!
import FormularioConta from "./components/FormularioConta";
import ListaContas from "./components/ListaContas";
import ResumoFinanceiro from "./components/ResumoFinanceiro";

export default function App() {
  const [contas, setContas] = useState(() => {
    const saved = localStorage.getItem("contas");
    return saved ? JSON.parse(saved) : [];
  });

  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().getMonth() + 1
  ); // 1-12
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );

  useEffect(() => {
    localStorage.setItem("contas", JSON.stringify(contas));
  }, [contas]);

  const adicionarConta = ({
    descricao,
    valor,
    categoria,
    vencimento,
    parcelas,
  }) => {
    const novasContas = [...contas];
    let mes = mesSelecionado;
    let ano = anoSelecionado;

    // Calcula o valor de cada parcela (com precisão de centavos)
    const valorParcela = Math.round((Number(valor) / parcelas) * 100) / 100;

    // Para ajustar possíveis diferenças de centavos na última parcela:
    let valorRestante = Number(valor);

    for (let i = 0; i < parcelas; i++) {
      if (mes > 12) {
        mes = 1;
        ano += 1;
      }

      // Ajusta a data de vencimento para o mês/ano da parcela
      let vencimentoAjustado = vencimento;
      if (vencimento) {
        const data = new Date(vencimento);
        data.setMonth(mes - 1);
        data.setFullYear(ano);
        vencimentoAjustado = data.toISOString().slice(0, 10);
      }

      // Última parcela recebe o valor restante para garantir o total correto
      const valorAtual =
        i === parcelas - 1
          ? Math.round(valorRestante * 100) / 100
          : valorParcela;
      valorRestante -= valorParcela;

      novasContas.push({
        id: uuid(),
        descricao: `${descricao}${
          parcelas > 1 ? ` (${i + 1}/${parcelas})` : ""
        }`,
        valor: valorAtual,
        categoria,
        vencimento: vencimentoAjustado,
        pago: false,
        mes,
        ano,
      });
      mes += 1;
    }
    setContas(novasContas);
  };

  const removerConta = (id) => {
    setContas(contas.filter((c) => c.id !== id));
  };

  const alternarPago = (id) => {
    setContas(contas.map((c) => (c.id === id ? { ...c, pago: !c.pago } : c)));
  };

  const editarConta = (contaEditada) => {
    setContas(
      contas.map((c) =>
        c.id === contaEditada.id ? { ...c, ...contaEditada } : c
      )
    );
  };

  const gerarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório de Contas", 14, 15);

    autoTable(doc, {
      head: [["Descrição", "Valor (R$)", "Categoria", "Vencimento", "Pago"]],
      body: contas.map((c) => [
        c.descricao,
        c.valor.toFixed(2),
        c.categoria,
        c.vencimento || "-",
        c.pago ? "Sim" : "Não",
      ]),
      startY: 25,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [238, 238, 238] },
      margin: { left: 14, right: 14 },
    });

    doc.save("relatorio-contas.pdf");
  };

  const contasFiltradas = contas.filter(
    (c) => c.mes === mesSelecionado && c.ano === anoSelecionado
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Controle Financeiro
        </h1>
        <div className="flex gap-2 justify-center mb-4">
          <select
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(Number(e.target.value))}
            className="p-2 rounded border"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {String(i + 1).padStart(2, "0")}
              </option>
            ))}
          </select>
          <select
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(Number(e.target.value))}
            className="p-2 rounded border"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const ano = new Date().getFullYear() - 2 + i;
              return (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              );
            })}
          </select>
        </div>
        <FormularioConta onAdicionar={adicionarConta} />
        <ListaContas
          contas={contasFiltradas}
          onTogglePago={alternarPago}
          onRemover={removerConta}
          onEditar={editarConta} // <-- Passe a função aqui!
        />
        <button
          onClick={gerarPDF}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 block mx-auto"
        >
          Gerar PDF
        </button>
      </div>
    </div>
  );
}
