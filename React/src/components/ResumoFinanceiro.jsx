export default function ResumoFinanceiro({ contas }) {
  const totalGeral = contas
    .filter((c) => c.categoria !== "Entradas")
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalEntradas = contas
    .filter((c) => c.categoria === "Entradas")
    .reduce((acc, curr) => acc + curr.valor, 0);

  // Corrigido: troca 'paga' por 'pago'
  const totalNaoPagas = contas
    .filter((c) => c.categoria !== "Entradas" && !c.pago)
    .reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <div className="mt-6 p-4 bg-gray-200 rounded">
      <p className="text-lg font-semibold">
        Total Despesas: R$ {totalGeral.toFixed(2)}
      </p>
      <p className="text-lg font-semibold">
        Total Entradas: R$ {totalEntradas.toFixed(2)}
      </p>
      <p className="text-lg font-semibold text-red-600">
        Contas Não Pagas: R$ {totalNaoPagas.toFixed(2)}
      </p>
      <p className="text-lg font-bold">
        Saldo Final: R$ {(totalEntradas - totalGeral).toFixed(2)}
      </p>
    </div>
  );
}
