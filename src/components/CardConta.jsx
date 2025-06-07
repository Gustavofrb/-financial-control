export default function CardConta({ conta, onTogglePago, onRemover, onEditar }) {
  return (
    <div className="bg-white p-3 rounded shadow flex justify-between items-center">
      <div>
        <span className={`font-medium ${conta.pago ? "line-through text-gray-400" : ""}`}>
          {conta.descricao} - R$ {conta.valor.toFixed(2)} {conta.vencimento && `(Venc. ${conta.vencimento})`}
        </span>
      </div>
      <div className="space-x-2 flex items-center">
        {conta.categoria !== "Entradas" && (
          <input
            type="checkbox"
            checked={conta.pago}
            onChange={() => onTogglePago(conta.id)}
            className="w-5 h-5 accent-green-600 cursor-pointer"
            title={conta.pago ? "Desmarcar como pago" : "Marcar como pago"}
          />
        )}
        <button
          onClick={() => onEditar(conta)}
          className="p-2 rounded hover:bg-yellow-100 transition"
          title="Editar"
        >
          {/* Ícone de lápis SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415a1 1 0 01-1.263-1.263l1.415-4.243a4 4 0 01.828-1.414z" />
          </svg>
        </button>
        <button
          onClick={() => onRemover(conta.id)}
          className="p-2 rounded hover:bg-red-100 transition"
          title="Remover"
        >
          {/* Ícone de lixeira SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
