function AuthModal({
  isOpen,
  onClose,
  isServerConnected,
  isRegisterMode,
  setIsRegisterMode,
  usernameInput,
  setUsernameInput,
  passwordInput,
  setPasswordInput,
  authMessage,
  setAuthMessage,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1c1c32] border border-[#C8911A]/40 rounded-2xl max-w-md w-full shadow-2xl relative p-8">
        <button
          onClick={() => {
            onClose();
            setAuthMessage({ text: "", isError: false });
          }}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold z-50"
        >
          ✕
        </button>

        {!isServerConnected ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 py-8 space-y-2">
            <span className="text-[18px] font-bold text-red-400 uppercase tracking-wider">
              Conecte-se ao servidor primeiro
            </span>
            <p className="text-sm max-w-xs">
              Insira um IP local válido antes de realizar autenticações.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-center text-[#C8911A] text-[28px] font-bold mb-6">
              {isRegisterMode ? "Criar Conta" : "Entrar"}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#141423] border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8911A]"
                  placeholder="Digite seu username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Senha
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#141423] border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8911A]"
                  placeholder="Digite sua senha"
                />
              </div>

              {authMessage.text && (
                <p
                  className={`text-sm text-center font-bold ${authMessage.isError ? "text-red-500" : "text-green-500"}`}
                >
                  {authMessage.text}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#C8911A] hover:brightness-110 text-black font-bold py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                {isRegisterMode ? "Registrar Agora" : "Entrar na Conta"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm">
              <button
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setAuthMessage({ text: "", isError: false });
                }}
                className="text-[#C8911A] hover:underline cursor-pointer"
              >
                {isRegisterMode
                  ? "Já tem conta? Faça login"
                  : "Não tem conta? Cadastre-se"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
