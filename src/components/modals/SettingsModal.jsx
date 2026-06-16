function SettingsModal({
  isOpen,
  onClose,
  usuarioLogado,
  uiScale,
  setUiScale,
  onLogout,
  onDeleteAccount,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1c1c32] border border-[#C8911A]/40 rounded-2xl max-w-md w-full shadow-2xl relative p-8 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold transition-colors"
        >
          ✕
        </button>

        <h3 className="text-center text-[#C8911A] text-[24px] font-bold mb-6 uppercase tracking-wider">
          Configurações
        </h3>

        <div className="space-y-6">
          <div className="bg-[#141423] p-4 rounded-lg border border-white/5">
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Tamanho da Interface (UI Scale): {uiScale}%
            </label>
            <input
              type="range"
              min="75"
              max="125"
              step="5"
              value={uiScale}
              onChange={(e) => setUiScale(e.target.value)}
              className="w-full h-2 bg-[#1b1b2f] rounded-lg appearance-none cursor-pointer accent-[#C8911A]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>75%</span>
              <span>100%</span>
              <span>125%</span>
            </div>
          </div>

          {usuarioLogado ? (
            <div className="space-y-3 pt-2">
              <button
                onClick={onLogout}
                className="w-full bg-linear-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white font-bold py-2 rounded-lg transition-all active:scale-95 cursor-pointer text-sm"
              >
                Sair da Conta
              </button>

              <button
                onClick={onDeleteAccount}
                className="w-full bg-transparent hover:bg-red-600/20 border border-red-600/40 text-red-400 hover:text-red-200 font-bold py-2 rounded-lg transition-all text-xs cursor-pointer"
              >
                Excluir Minha Conta
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 italic py-4">
              Faça login para gerenciar sua conta.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
