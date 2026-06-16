function ProfileModal({
  isOpen,
  onClose,
  usuario,
  usuarioLogado,
  avatarUrl,
  setAvatarUrl,
  bannerUrl,
  setBannerUrl,
  rankingList,
  onSaveCustomization,
  onLogout,
}) {
  if (!isOpen || !usuario) return null;

  const ehOProprioPerfil =
    usuarioLogado && usuarioLogado.idUsuario === usuario.idUsuario;

  const indexUsuario = rankingList.findIndex(
    (p) => p.idUsuario === usuario.idUsuario,
  );
  let posicaoRanking = indexUsuario + 1;

  if (indexUsuario > 0) {
    const usuarioAtual = rankingList[indexUsuario];
    const primeiroEmpatado = rankingList.find(
      (p) => p.pontos === usuarioAtual.pontos,
    );
    if (primeiroEmpatado) {
      posicaoRanking = rankingList.indexOf(primeiroEmpatado) + 1;
    }
  }

  const textoRank = posicaoRanking > 0 ? `#${posicaoRanking}` : "Sem Rank";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1c1c32] border border-[#C8911A]/40 rounded-2xl max-w-4xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold z-50 bg-black/40 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="flex flex-col h-full overflow-y-auto">
          <div className="h-48 w-full bg-[#141423] relative shrink-0">
            {usuario.banner ? (
              <img
                src={usuario.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-r from-[#21366B] to-[#1B1B2F]" />
            )}
            <div className="absolute -bottom-12 left-8 flex items-end gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-[#1c1c32] bg-[#21366B] overflow-hidden shrink-0 shadow-lg">
                {usuario.fotoPerfil ? (
                  <img
                    src={usuario.fotoPerfil}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold uppercase">
                    {usuario.nomeUsuario.substring(0, 2)}
                  </div>
                )}
              </div>
              <div className="mb-2">
                <h3 className="text-2xl font-bold text-white drop-shadow-md">
                  {usuario.nomeUsuario}
                </h3>
                <div className="text-[22px] font-black text-[#C8911A] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
                  {textoRank} Global
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 p-8 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            <div className="md:col-span-2 space-y-4">
              {ehOProprioPerfil ? (
                <div className="bg-[#141423] p-4 rounded-lg border border-white/5">
                  <h4 className="text-[#C8911A] font-bold text-sm uppercase tracking-wider mb-3">
                    Customizar Perfil
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        URL da Imagem de Avatar
                      </label>
                      <input
                        type="text"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://link-da-imagem.com/foto.jpg"
                        className="w-full bg-[#1b1b2f] border border-white/10 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#C8911A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        URL da Imagem de Banner
                      </label>
                      <input
                        type="text"
                        value={bannerUrl}
                        onChange={(e) => setBannerUrl(e.target.value)}
                        placeholder="https://link-da-imagem.com/banner.jpg"
                        className="w-full bg-[#1b1b2f] border border-white/10 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#C8911A]"
                      />
                    </div>
                    <button
                      onClick={onSaveCustomization}
                      className="bg-[#C8911A] hover:brightness-110 text-black font-bold text-xs py-2 px-4 rounded transition-all cursor-pointer"
                    >
                      Salvar Customização
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#141423] p-6 rounded-lg border border-white/5 flex items-center justify-center h-full min-h-[150px]">
                  <p className="text-gray-400 text-sm italic">
                    Visualizando o perfil público deste usuário.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-[#141423] p-4 rounded-lg border border-white/5 space-y-3 text-sm">
                <h4 className="text-[#C8911A] font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-1">
                  Estatísticas
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pontos de Ranking:</span>
                  <span className="font-mono text-green-400 font-bold">
                    {usuario.pontos} P
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Moedas:</span>
                  <span className="font-mono text-yellow-400 font-bold">
                    {usuario.moedas}G
                  </span>
                </div>
              </div>

              {ehOProprioPerfil && (
                <button
                  onClick={onLogout}
                  className="w-full bg-red-600/20 hover:bg-red-600 border border-red-600/40 text-white font-bold py-2 rounded transition-all text-sm cursor-pointer"
                >
                  Sair da Conta
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
