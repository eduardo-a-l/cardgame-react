import React from "react";
import ArrowLeftCircleImg from "../assets/Arrow left-circle.svg";

function InventarioPage({ vm }) {
  if (!vm.isInventarioOpen) return null;

  const getCardBackgroundColor = (tipo) => {
    switch (tipo) {
      case "Personagem":
        return "from-[#2a437e] to-[#14213d]";
      case "Suporte":
        return "from-[#2a6f97] to-[#014f86]";
      case "Campo":
        return "from-[#6f2db8] to-[#3c096c]";
      default:
        return "from-[#4a4e69] to-[#22223b]";
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
        <div className="w-[60%] bg-[#141423]/60 border border-white/5 rounded-2xl p-4 flex flex-col overflow-hidden">
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
            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-4 pr-1">
              {vm.inventarioCartas.map((carta, index) => (
                <div
                  key={`${carta.idCarta}-${index}`}
                  onClick={() => vm.setCartaSelecionada(carta)}
                  className={`relative h-44 rounded-xl p-4 flex flex-col justify-between cursor-pointer border transition-all shadow-md active:scale-95 bg-linear-to-br ${getCardBackgroundColor(carta.tipo)} ${
                    vm.cartaSelecionada?.idInventario === carta.idInventario
                      ? "border-[#C8911A] scale-[1.02] shadow-[0_0_15px_rgba(200,145,26,0.3)]"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div>
                    <div className="font-bold text-base truncate">
                      {carta.nome}
                    </div>
                    <div className="text-[11px] opacity-60 uppercase tracking-wide mt-0.5">
                      {carta.tipo}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <span
                      className={`text-xs font-bold ${getRaridadeColor(carta.raridade)}`}
                    >
                      {carta.raridade}
                    </span>
                    {carta.vida && (
                      <span className="text-xs bg-black/40 px-2 py-0.5 rounded-md font-mono">
                        HP: {carta.vida}
                      </span>
                    )}
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
                  className={`p-4 rounded-xl bg-linear-to-br border border-white/10 ${getCardBackgroundColor(vm.cartaSelecionada.tipo)}`}
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
                  className="w-full bg-[#21366B] hover:bg-red-900/40 border-2 border-[#C8911A] rounded-xl py-3 flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer group"
                >
                  <span className="font-black text-lg uppercase tracking-wider group-hover:text-red-200">
                    Vender Carta
                  </span>
                  <span className="text-sm font-mono text-green-400 font-bold mt-0.5">
                    +{Math.floor(vm.cartaSelecionada.precoPadrao * 0.5)}G
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
