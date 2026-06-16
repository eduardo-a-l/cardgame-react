import IconRankingImg from "../../assets/IconRanking.svg";

function RankingModal({
  isOpen,
  onClose,
  isServerConnected,
  rankingList,
  onSelectPlayer,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1B1B2F] border-2 border-[#C8911A] rounded-[20px] max-w-2xl w-full p-6 shadow-2xl relative h-[80vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={IconRankingImg} alt="" className="w-8 h-8" />
          <h3 className="text-[#C8911A] text-[28px] font-bold">
            Ranking Global
          </h3>
        </div>

        {!isServerConnected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
            <span className="text-[18px] font-bold text-red-400">
              Conecte-se ao servidor primeiro
            </span>
            <p className="text-sm max-w-xs">
              Insira um IP local válido antes de acessar o Ranking.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden border border-[#21366B] rounded-lg">
            <div className="flex bg-[#21366B] p-3 text-sm font-bold text-center border-b border-[#21366B]">
              <span className="w-16">Posição</span>
              <span className="flex-1 text-left px-4">Nome de Usuário</span>
              <span className="w-24">Pontos</span>
              <span className="w-24">Moedas</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#21366B]/50 font-sans">
              {rankingList.map((player, index) => {
                const position = index + 1;
                let colorClass = "text-white";
                if (position === 1) colorClass = "text-[#D4AF37] font-bold";
                if (position === 2) colorClass = "text-[#C0C0C0] font-bold";
                if (position === 3) colorClass = "text-[#CD7F32] font-bold";

                return (
                  <div
                    key={player.idUsuario}
                    onClick={() => onSelectPlayer(player)}
                    className="flex p-3 text-center items-center hover:bg-[#21366B]/20 transition-colors cursor-pointer"
                  >
                    <span className={`w-16 ${colorClass}`}>{position}º</span>
                    <span className="flex-1 text-left px-4 font-semibold flex items-center gap-2">
                      {player.fotoPerfil && (
                        <img
                          src={player.fotoPerfil}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover shrink-0 border border-[#C8911A]/40"
                        />
                      )}
                      {player.nomeUsuario}
                    </span>
                    <span className="w-24 text-green-400 font-mono">
                      {player.pontos}
                    </span>
                    <span className="w-24 text-[#C8911A] font-mono">
                      {player.moedas}G
                    </span>
                  </div>
                );
              })}
              {rankingList.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Nenhum registro encontrado.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RankingModal;
