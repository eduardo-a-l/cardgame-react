import { useEffect } from "react";
import { useMontagemViewModel } from "../viewmodels/useMontagemViewModel";
import ArrowLeftCircleImg from "../assets/Arrow left-circle.svg";

function MontagemBaralhoPage({ idBaralho, idUsuarioLogado, onVoltar }) {
  const viewModel = useMontagemViewModel();

  useEffect(() => {
    viewModel.carregarDados(idBaralho, idUsuarioLogado);
  }, [idBaralho, idUsuarioLogado]);

  return (
    <div className="fixed inset-0 bg-[#1B1B2F] z-50 flex flex-col p-6 select-none overflow-hidden text-white">
      <div className="w-full flex items-center justify-between border-b border-[#C8911A]/30 pb-4 mb-6">
        <button
          onClick={onVoltar}
          className="flex items-center gap-2 cursor-pointer text-lg font-semibold hover:scale-105 transition-transform"
        >
          <img src={ArrowLeftCircleImg} alt="Voltar" className="w-8 h-8" />
          <span>Voltar</span>
        </button>
        <h1 className="text-2xl font-bold tracking-wide">Montar Baralho</h1>
        <button
          onClick={() => viewModel.salvar(idBaralho, idUsuarioLogado, onVoltar)}
          className="bg-[#C8911A] hover:brightness-110 text-black font-bold px-6 py-2 rounded-xl border border-white shadow-md transition-all active:scale-95 cursor-pointer text-sm"
        >
          Salvar
        </button>
      </div>

      <div className="w-full max-w-md mx-auto mb-6 flex flex-col items-center gap-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Nome do Baralho
        </label>
        <input
          type="text"
          value={viewModel.nomeBaralho}
          onChange={(e) => viewModel.setNomeBaralho(e.target.value)}
          className="w-full text-center bg-[#141423]/80 border border-[#C8911A] rounded-xl px-4 py-2 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#C8911A]"
        />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        <div className="bg-[#141423]/80 border border-[#C8911A]/40 rounded-2xl p-4 flex flex-col min-h-0">
          <h2 className="text-center font-bold text-lg mb-3 pb-2 border-b border-slate-700 text-[#C8911A]">
            Baralho Atual ({viewModel.itensNoBaralho.length})
          </h2>
          <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 p-1">
            {viewModel.itensNoBaralho.map((item) => (
              <div
                key={`deck-${item.idInventario}`}
                onClick={() => viewModel.removerCarta(item)}
                className="aspect-[3/4] bg-[#21366B] border border-red-500/50 rounded-lg p-2 flex flex-col items-center justify-between cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-full flex-1 bg-slate-800/50 rounded flex items-center justify-center text-[10px] text-center font-medium">
                  {item.lojaItem?.nomeItem || "Carta"}
                </div>
                <span className="text-[10px] text-center mt-1 w-full truncate text-slate-200">
                  {item.lojaItem?.nomeItem || "Carta"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#141423]/80 border border-[#C8911A]/40 rounded-2xl p-4 flex flex-col min-h-0">
          <h2 className="text-center font-bold text-lg mb-3 pb-2 border-b border-slate-700 text-[#C8911A]">
            Seu Inventário
          </h2>
          <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 p-1">
            {viewModel.inventarioFull.map((item) => {
              const jaNoBaralho = viewModel.itensNoBaralho.some(
                (i) => i.idInventario === item.idInventario,
              );
              return (
                <div
                  key={`inv-${item.idInventario}`}
                  onClick={() => !jaNoBaralho && viewModel.adicionarCarta(item)}
                  className={`aspect-[3/4] border rounded-lg p-2 flex flex-col items-center justify-between transition-all ${
                    jaNoBaralho
                      ? "bg-slate-800 border-slate-700 opacity-40 cursor-not-allowed"
                      : "bg-[#21366B] border-[#C8911A] cursor-pointer hover:scale-105"
                  }`}
                >
                  <div className="w-full flex-1 bg-slate-800/50 rounded flex items-center justify-center text-[10px] text-center font-medium">
                    {item.lojaItem?.nomeItem || "Carta"}
                  </div>
                  <span
                    className={`text-[10px] text-center mt-1 w-full truncate ${jaNoBaralho ? "text-slate-500" : "text-white"}`}
                  >
                    {item.lojaItem?.nomeItem || "Carta"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MontagemBaralhoPage;
