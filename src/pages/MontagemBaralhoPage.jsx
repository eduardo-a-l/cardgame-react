import { useEffect } from "react";
import { useMontagemViewModel } from "../viewmodels/useMontagemViewModel";
import ArrowLeftCircleImg from "../assets/Arrow left-circle.svg";

function getCardBg(tipo) {
  switch (tipo) {
    case "Personagem":
      return "bg-[#21366B]";
    case "Suporte":
      return "bg-[#53216B]";
    case "Campo":
      return "bg-[#216B35]";
    default:
      return "bg-[#22223b]";
  }
}

function MontagemBaralhoPage({ idBaralho, idUsuarioLogado, onVoltar }) {
  const vm = useMontagemViewModel();

  useEffect(() => {
    vm.carregarDados(idBaralho, idUsuarioLogado);
  }, [idBaralho, idUsuarioLogado]);

  const handleSalvar = () => {
    vm.salvar(
      idBaralho,
      idUsuarioLogado,
      onVoltar,
      () => alert("Erro ao salvar baralho.")
    );
  };

  const getIdInv = (item) => item.idInventario ?? item.IdInventario;

  const jaNoBaralho = (item) =>
    vm.itensNoBaralho.some((i) => getIdInv(i) === getIdInv(item));

  return (
    <div className="fixed inset-0 bg-[#1B1B2F] z-40 flex flex-col p-6 text-white font-sans animate-fadeIn select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <button
          onClick={onVoltar}
          className="flex items-center gap-2 bg-transparent border-none text-white text-lg font-bold cursor-pointer hover:text-[#C8911A] transition-colors"
        >
          <img src={ArrowLeftCircleImg} alt="" className="w-8 h-8" />
          Voltar
        </button>

        <div className="flex flex-col items-center gap-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Nome do Baralho
          </label>
          <input
            type="text"
            value={vm.nomeBaralho}
            onChange={(e) => vm.setNomeBaralho(e.target.value)}
            className="text-center bg-[#141423]/80 border border-[#C8911A] rounded-xl px-4 py-1.5 text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#C8911A] w-64"
          />
        </div>

        <button
          onClick={handleSalvar}
          className="bg-[#C8911A] hover:brightness-110 text-black font-black px-6 py-2 rounded-xl border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider text-sm"
        >
          Salvar
        </button>
      </div>

      {vm.isLoading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Carregando dados...
        </div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="w-[60%] bg-[#0d0d1b] border border-white/5 rounded-2xl p-4 flex flex-col overflow-hidden">
            <div className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              Meu Inventário ({vm.inventarioFull.length})
            </div>

            {vm.inventarioFull.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500 italic text-center p-8">
                Você não possui cartas no inventário.
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-4 pr-1">
                {vm.inventarioFull.map((item, index) => {
                  const nome = vm.getNomeCarta(item);
                  const tipo = vm.getTipoCarta(item);
                  const emBaralho = jaNoBaralho(item);
                  return (
                    <div
                      key={`inv-${getIdInv(item)}-${index}`}
                      onClick={() => !emBaralho && vm.adicionarCarta(item)}
                      className={`relative h-52 rounded-xl p-3 flex items-center justify-center text-center border-2 transition-all shadow-md ${getCardBg(tipo)} ${
                        emBaralho
                          ? "opacity-40 cursor-not-allowed border-[#686868]"
                          : "cursor-pointer active:scale-95 border-[#686868] hover:border-white/30"
                      }`}
                    >
                      {emBaralho && (
                        <span className="absolute top-2 right-2 text-[9px] bg-amber-600/90 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider border border-amber-400/30 shadow-sm z-10">
                          No Baralho
                        </span>
                      )}
                      <div className="font-bold text-sm text-white break-words">
                        {nome}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-[40%] bg-[#141423]/90 border border-[#C8911A]/30 rounded-2xl p-4 flex flex-col overflow-hidden">
            <div className="text-sm font-semibold text-[#C8911A] mb-3 uppercase tracking-wider border-b border-white/10 pb-2">
              Baralho Atual ({vm.itensNoBaralho.length})
            </div>

            {vm.itensNoBaralho.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-4 space-y-2">
                <div className="text-base font-bold text-[#C8911A] uppercase tracking-widest">
                  Baralho Vazio
                </div>
                <p className="text-xs text-gray-500 max-w-xs">
                  Clique nas cartas do inventário para adicioná-las ao baralho.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 pr-1">
                {vm.itensNoBaralho.map((item, index) => {
                  const nome = vm.getNomeCarta(item);
                  const tipo = vm.getTipoCarta(item);
                  return (
                    <div
                      key={`deck-${getIdInv(item)}-${index}`}
                      onClick={() => vm.removerCarta(item)}
                      title="Clique para remover"
                      className={`relative h-40 rounded-xl p-3 flex items-center justify-center text-center cursor-pointer border-2 border-red-500/40 transition-all shadow-md hover:border-red-400 hover:scale-[1.02] active:scale-95 ${getCardBg(tipo)}`}
                    >
                      <span className="absolute top-1 right-1 text-[9px] bg-red-700/80 text-white font-bold px-1 py-0.5 rounded text-center leading-tight">
                        ✕
                      </span>
                      <div className="font-bold text-xs text-white break-words">
                        {nome}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MontagemBaralhoPage;
