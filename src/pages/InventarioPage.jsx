import React from "react";
import ArrowLeftCircleImg from "../assets/Arrow left-circle.svg";

function InventarioPage({ vm }) {
  if (!vm.isInventarioOpen) return null;

  const getCardBackgroundColor = (tipo) => {
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
  };

  const getRaridadeColor = (raridade) => {
    switch (raridade) {
      case "Comum":
        return "text-white";
      case "Incomum":
        return "text-green-400";
      case "Raro":
        return "text-blue-400";
      case "Ultra Raro":
        return "text-purple-400";
      case "Lendário":
        return "text-yellow-400";
      default:
        return "text-white";
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1B1B2F] z-40 flex flex-col p-6 text-white font-sans animate-fadeIn select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <button
          onClick={() => {
            vm.setIsInventarioOpen(false);
            vm.setCartaSelecionada(null);
          }}
          className="flex items-center gap-2 bg-transparent border-none text-white text-lg font-bold cursor-pointer hover:text-[#C8911A] transition-colors"
        >
          <img src={ArrowLeftCircleImg} alt="" className="w-8 h-8" />
          Voltar
        </button>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 tracking-wider uppercase">
          Meu Inventário
        </h2>
        <div className="text-right">
          <span className="text-[#C8911A] font-mono font-bold block text-lg">
            {vm.usuarioLogado?.moedas}G
          </span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="w-[60%] bg-[#0d0d1b] border border-white/5 rounded-2xl p-4 flex flex-col overflow-hidden">
          <div className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            Minhas Cartas ({vm.inventarioCartas.length})
          </div>

          {vm.isLoadingInventario ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Carregando inventário...
            </div>
          ) : vm.inventarioCartas.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 italic text-center p-8">
              Você ainda não possui cartas em seu inventário.
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-4 pr-1">
              {vm.inventarioCartas.map((carta, index) => (
                <div
                  key={`${carta.idCarta}-${index}`}
                  onClick={() => vm.setCartaSelecionada(carta)}
                  className={`relative h-52 rounded-xl p-3 flex items-center justify-center text-center cursor-pointer border-2 transition-all shadow-md active:scale-95 ${getCardBackgroundColor(carta.tipo)} ${
                    vm.cartaSelecionada?.idInventario === carta.idInventario
                      ? "border-[#C8911A] scale-[1.02] shadow-[0_0_15px_rgba(200,145,26,0.3)]"
                      : "border-[#686868] hover:border-white/30"
                  }`}
                >
                  {carta.estaEmBaralho && (
                    <span className="absolute top-2 right-2 text-[9px] bg-amber-600/90 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider border border-amber-400/30 shadow-sm z-10 animate-fadeIn">
                      Em Baralho
                    </span>
                  )}
                  <div className="font-bold text-sm text-white break-words">
                    {carta.nome}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-[40%] bg-[#141423]/90 border border-[#C8911A]/30 rounded-2xl p-6 flex flex-col justify-between overflow-y-auto">
          {vm.cartaSelecionada ? (
            <div className="flex flex-col h-full justify-between space-y-6">
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border border-white/10 ${getCardBackgroundColor(vm.cartaSelecionada.tipo)}`}
                >
                  <h3 className="text-2xl font-black text-center drop-shadow">
                    {vm.cartaSelecionada.nome}
                  </h3>
                </div>

                <div className="space-y-2 text-sm bg-[#1b1b2f] p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="font-semibold">
                      {vm.cartaSelecionada.tipo}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Raridade:</span>
                    <span
                      className={`font-bold ${getRaridadeColor(vm.cartaSelecionada.raridade)}`}
                    >
                      {vm.cartaSelecionada.raridade}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Preço Padrão:</span>
                    <span className="font-mono text-[#C8911A] font-bold">
                      {vm.cartaSelecionada.precoPadrao}G
                    </span>
                  </div>
                  {vm.cartaSelecionada.vida && (
                    <div className="flex justify-between pb-1">
                      <span className="text-gray-400">Vida (HP):</span>
                      <span className="font-mono font-bold text-red-400">
                        {vm.cartaSelecionada.vida}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {vm.cartaSelecionada.acao1 && (
                    <div className="bg-[#1b1b2f] p-3 rounded-xl border-l-4 border-[#C8911A] text-sm">
                      <div className="text-[#C8911A] font-bold text-xs uppercase mb-1">
                        {vm.cartaSelecionada.tipo === "Personagem"
                          ? "Ação 1"
                          : "Efeito"}
                      </div>
                      <p className="text-gray-200 leading-relaxed">
                        {vm.cartaSelecionada.acao1}
                      </p>
                    </div>
                  )}

                  {vm.cartaSelecionada.acao2 && (
                    <div className="bg-[#1b1b2f] p-3 rounded-xl border-l-4 border-[#C8911A] text-sm">
                      <div className="text-[#C8911A] font-bold text-xs uppercase mb-1">
                        Ação 2
                      </div>
                      <p className="text-gray-200 leading-relaxed">
                        {vm.cartaSelecionada.acao2}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => vm.handleVenderCarta(vm.cartaSelecionada)}
                  disabled={vm.cartaSelecionada.estaEmBaralho}
                  className={`w-full border-2 rounded-xl py-3 flex flex-col items-center justify-center transition-all active:scale-95 group ${
                    vm.cartaSelecionada.estaEmBaralho
                      ? "bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed"
                      : "bg-[#21366B] hover:bg-red-900/40 border-[#C8911A] cursor-pointer"
                  }`}
                >
                  <span className="font-black text-lg uppercase tracking-wider group-hover:text-red-200">
                    {vm.cartaSelecionada.estaEmBaralho
                      ? "Carta Equipada"
                      : "Vender Carta"}
                  </span>
                  <span
                    className={`text-sm font-mono font-bold mt-0.5 ${
                      vm.cartaSelecionada.estaEmBaralho
                        ? "text-amber-400"
                        : "text-green-400"
                    }`}
                  >
                    {vm.cartaSelecionada.estaEmBaralho
                      ? "Remova do baralho para vender"
                      : `+${Math.floor(vm.cartaSelecionada.precoPadrao * 0.5)}G`}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-4 space-y-2">
              <div className="text-base font-bold text-[#C8911A] uppercase tracking-widest">
                Nenhuma Seleção
              </div>
              <p className="text-xs text-gray-500 max-w-xs">
                Selecione uma carta ao lado para ver os detalhes completos,
                atributos e ações.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventarioPage;
