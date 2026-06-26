import { useEffect, useState } from "react";
import { useBaralhoViewModel } from "../viewmodels/useBaralhoViewModel";
import ArrowLeftCircleImg from "../assets/Arrow left-circle.svg";

function MeusBaralhosPage({ onClose, onEditarBaralho, idUsuarioLogado }) {
  const vm = useBaralhoViewModel();
  const [baralhoSelecionado, setBaralhoSelecionado] = useState(null);
  const [confirmandoExcluir, setConfirmandoExcluir] = useState(false);

  useEffect(() => {
    vm.carregar(idUsuarioLogado);
  }, [idUsuarioLogado]);

  const handleSelecionar = (baralho) => {
    setBaralhoSelecionado(baralho);
    setConfirmandoExcluir(false);
  };

  const handleCriar = async () => {
    const novo = await vm.criar(idUsuarioLogado);
    if (novo) setBaralhoSelecionado(novo);
  };

  const handleExcluir = async () => {
    if (!baralhoSelecionado) return;
    if (!confirmandoExcluir) {
      setConfirmandoExcluir(true);
      return;
    }
    await vm.excluir(baralhoSelecionado.idBaralho);
    setBaralhoSelecionado(null);
    setConfirmandoExcluir(false);
  };

  return (
    <div className="fixed inset-0 bg-[#1B1B2F] z-40 flex flex-col p-6 text-white font-sans animate-fadeIn select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 bg-transparent border-none text-white text-lg font-bold cursor-pointer hover:text-[#C8911A] transition-colors"
        >
          <img src={ArrowLeftCircleImg} alt="" className="w-8 h-8" />
          Voltar
        </button>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wider uppercase">
          Meus Baralhos
        </h2>
        <div className="text-right">
          <span className="text-[#C8911A] font-mono font-bold block text-lg">
            {vm.baralhos.length} baralho{vm.baralhos.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="w-[60%] bg-[#0d0d1b] border border-white/5 rounded-2xl p-4 flex flex-col overflow-hidden">
          <div className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            Baralhos ({vm.baralhos.length})
          </div>

          {vm.isLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Carregando baralhos...
            </div>
          ) : vm.baralhos.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 italic text-center p-8 gap-4">
              <p>Você ainda não possui baralhos.</p>
              <button
                onClick={handleCriar}
                className="bg-[#C8911A] hover:brightness-110 text-black font-black px-6 py-2 rounded-xl transition-all active:scale-95 cursor-pointer text-sm uppercase tracking-wider"
              >
                Criar Primeiro Baralho
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-4 pr-1">
              {vm.baralhos.map((baralho) => {
                const isSelected =
                  baralhoSelecionado?.idBaralho === baralho.idBaralho;
                const qtdCartas =
                  (baralho.Inventarios || baralho.inventarios || []).length;
                return (
                  <div
                    key={baralho.idBaralho}
                    onClick={() => handleSelecionar(baralho)}
                    className={`relative h-52 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer border-2 transition-all shadow-md active:scale-95 bg-[#21366B] ${
                      isSelected
                        ? "border-[#C8911A] scale-[1.02] shadow-[0_0_15px_rgba(200,145,26,0.3)]"
                        : "border-[#686868] hover:border-white/30"
                    }`}
                  >
                    <div className="font-bold text-sm text-white break-words leading-tight">
                      {baralho.nome}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {qtdCartas} carta{qtdCartas !== 1 ? "s" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-[40%] bg-[#141423]/90 border border-[#C8911A]/30 rounded-2xl p-6 flex flex-col justify-between overflow-y-auto">
          {baralhoSelecionado ? (
            <div className="flex flex-col h-full justify-between space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-white/10 bg-[#21366B]">
                  <h3 className="text-2xl font-black text-center drop-shadow">
                    {baralhoSelecionado.nome}
                  </h3>
                </div>

                <div className="space-y-2 text-sm bg-[#1b1b2f] p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Cartas no baralho:</span>
                    <span className="font-semibold">
                      {
                        (
                          baralhoSelecionado.Inventarios ||
                          baralhoSelecionado.inventarios ||
                          []
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-gray-400">ID:</span>
                    <span className="font-mono text-[#C8911A] font-bold">
                      #{baralhoSelecionado.idBaralho}
                    </span>
                  </div>
                </div>

                {(
                  baralhoSelecionado.Inventarios ||
                  baralhoSelecionado.inventarios ||
                  []
                ).length > 0 && (
                  <div className="bg-[#1b1b2f] p-4 rounded-xl border border-white/5 space-y-1 max-h-48 overflow-y-auto">
                    <div className="text-[#C8911A] font-bold text-xs uppercase mb-2 tracking-wider">
                      Cartas
                    </div>
                    {(
                      baralhoSelecionado.Inventarios ||
                      baralhoSelecionado.inventarios ||
                      []
                    ).map((inv, idx) => {
                      const nome =
                        inv?.carta?.nome ||
                        inv?.carta?.Nome ||
                        inv?.Carta?.nome ||
                        inv?.Carta?.Nome ||
                        `Carta #${inv.idInventario ?? inv.IdInventario}`;
                      return (
                        <div
                          key={idx}
                          className="text-sm text-gray-300 flex items-center gap-2"
                        >
                          <span className="text-[#C8911A] text-xs">▸</span>
                          {nome}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                <button
                  onClick={() => onEditarBaralho(baralhoSelecionado.idBaralho)}
                  className="w-full bg-[#21366B] hover:bg-[#2a4590] border-2 border-[#C8911A] rounded-xl py-3 font-black text-lg uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                >
                  Montar Baralho
                </button>

                <button
                  onClick={handleCriar}
                  className="w-full bg-transparent hover:bg-white/5 border-2 border-white/20 rounded-xl py-3 font-bold text-base uppercase tracking-wider transition-all active:scale-95 cursor-pointer text-gray-300"
                >
                  + Criar Novo
                </button>

                <button
                  onClick={handleExcluir}
                  className={`w-full rounded-xl py-3 font-bold text-base uppercase tracking-wider transition-all active:scale-95 cursor-pointer border-2 ${
                    confirmandoExcluir
                      ? "bg-red-700 border-red-400 text-white animate-pulse"
                      : "bg-transparent border-red-900/50 text-red-400 hover:bg-red-900/20"
                  }`}
                >
                  {confirmandoExcluir ? "Confirmar Exclusão?" : "Excluir"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-4 space-y-4">
              <div className="text-base font-bold text-[#C8911A] uppercase tracking-widest">
                Nenhuma Seleção
              </div>
              <p className="text-xs text-gray-500 max-w-xs">
                Selecione um baralho ao lado para ver os detalhes e gerenciá-lo.
              </p>
              <button
                onClick={handleCriar}
                className="mt-4 bg-[#C8911A] hover:brightness-110 text-black font-black px-6 py-2 rounded-xl transition-all active:scale-95 cursor-pointer text-sm uppercase tracking-wider"
              >
                + Criar Novo Baralho
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MeusBaralhosPage;
