import { useState, useEffect } from "react";
import LogoImg from "../assets/Logo.svg";
import PlayImg from "../assets/Play.svg";
import PackageImg from "../assets/Package.svg";
import BaralhosImg from "../assets/BaralhosIcone.svg";
import ArrowLeftCircleImg from "../assets/Arrow left-circle.svg";
import IconRankingImg from "../assets/IconRanking.svg";
import UserImg from "../assets/User.svg";
import SettingsImg from "../assets/Settings.svg";
import ShoppingCartImg from "../assets/Shopping cart.svg";
import BackgroundGif from "../assets/Background.gif";
import MenuButton from "../components/MenuButton";

function MainMenuPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [serverIp, setServerIp] = useState(() => {
    return localStorage.getItem("cardgame_server_ip") || "localhost:5000";
  });
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem("cardgame_user");
    return salvo ? JSON.parse(salvo) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authMessage, setAuthMessage] = useState({ text: "", isError: false });
  const [rankingList, setRankingList] = useState([]);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const getBaseUrl = () => {
    return serverIp.startsWith("http") ? serverIp : `http://${serverIp}`;
  };

  const testConnection = async (silent = false) => {
    try {
      const res = await fetch(`${getBaseUrl()}/cartas`);
      if (res.ok) {
        setIsServerConnected(true);
        if (!silent) alert("Conectado com sucesso ao servidor!");
        return true;
      }
    } catch (err) {
      setIsServerConnected(false);
      if (!silent)
        alert(
          "Não foi possível conectar a esse IP. Verifique se a API está rodando.",
        );
    }
    return false;
  };

  useEffect(() => {
    localStorage.setItem("cardgame_server_ip", serverIp);
    testConnection(true);
  }, [serverIp]);

  const loadRanking = async () => {
    if (!isServerConnected) return;
    try {
      const res = await fetch(`${getBaseUrl()}/usuarios/ranking`);
      if (res.ok) {
        const data = await res.json();
        setRankingList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isRankingModalOpen) {
      loadRanking();
    }
  }, [isRankingModalOpen, isServerConnected]);

  useEffect(() => {
    if (usuarioLogado) {
      setAvatarUrl(usuarioLogado.fotoPerfil || "");
      setBannerUrl(usuarioLogado.banner || "");
    }
  }, [usuarioLogado, isAuthModalOpen]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage({ text: "", isError: false });

    if (!usernameInput || !passwordInput) {
      setAuthMessage({ text: "Preencha todos os campos.", isError: true });
      return;
    }

    const endpoint = isRegisterMode ? "/usuarios" : "/usuarios/login";
    const payload = { nomeUsuario: usernameInput, senha: passwordInput };

    try {
      const res = await fetch(`${getBaseUrl()}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (isRegisterMode) {
          setAuthMessage({
            text: "Usuário cadastrado com sucesso! Mude para Entrar.",
            isError: false,
          });
        } else {
          setUsuarioLogado(data);
          localStorage.setItem("cardgame_user", JSON.stringify(data));
          setIsAuthModalOpen(false);
          setUsernameInput("");
          setPasswordInput("");
        }
      } else {
        if (isRegisterMode) {
          setAuthMessage({
            text: "Nome de usuário já existe, ou senha muito curta.",
            isError: true,
          });
        } else {
          setAuthMessage({
            text: "Usuário ou senha incorretos.",
            isError: true,
          });
        }
      }
    } catch (err) {
      setAuthMessage({
        text: "Erro de conexão com o servidor.",
        isError: true,
      });
    }
  };

  const handleSaveCustomization = async () => {
    if (!usuarioLogado || !isServerConnected) return;

    const payload = {
      idUsuario: usuarioLogado.idUsuario,
      fotoPerfil: avatarUrl || null,
      banner: bannerUrl || null,
    };

    try {
      const res = await fetch(`${getBaseUrl()}/usuarios/customizar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const usuarioAtualizado = await res.json();

        setUsuarioLogado(usuarioAtualizado);
        localStorage.setItem(
          "cardgame_user",
          JSON.stringify(usuarioAtualizado),
        );

        alert("Customização salva com sucesso no banco de dados!");
      } else {
        alert("Erro ao salvar customização na API.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão ao tentar salvar customização.");
    }
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem("cardgame_user");
  };

  return (
    <div
      className="relative w-screen h-screen bg-[#1B1B2F] overflow-hidden flex font-sans text-white select-none"
      onMouseMove={(e) => {
        if (e.clientX <= 150) {
          setIsHovered(true);
        } else {
          setIsHovered(false);
        }
      }}
    >
      <div
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `url(${BackgroundGif})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        className={`h-full flex flex-col justify-center gap-16 z-10 transition-all duration-300 ease-out
          ${isHovered ? "pl-[95px]" : "pl-[5px]"}`}
      >
        <MenuButton text="Jogar" iconSrc={PlayImg} />
        <MenuButton text="Inventário" iconSrc={PackageImg} />
        <MenuButton text="Baralhos" iconSrc={BaralhosImg} />
        <MenuButton text="Sair" iconSrc={ArrowLeftCircleImg} />
      </div>

      <div
        className={`absolute left-0 top-0 h-full w-[100px] bg-[#C8911A] flex flex-col justify-between items-center py-6 z-20 shadow-xl transition-all duration-300 ease-out
          ${isHovered ? "translate-x-0 pl-0" : "-translate-x-[88px] pl-[88px]"}`}
      >
        <div className="flex flex-col items-center gap-8 w-full transition-opacity duration-200">
          <button
            onClick={() => setIsRankingModalOpen(true)}
            className={`cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90 filter-[brightness(0)] ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={IconRankingImg}
              alt="Ranking"
              className="w-[35px] h-[35px]"
            />
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 flex flex-col items-center gap-1 w-full px-2 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            {usuarioLogado && usuarioLogado.fotoPerfil ? (
              <img
                src={usuarioLogado.fotoPerfil}
                alt="Perfil"
                className="w-[45px] h-[45px] rounded-full object-cover border-2 border-[#1B1B2F]"
              />
            ) : (
              <img
                src={UserImg}
                alt="Perfil"
                className="w-[35px] h-[35px] filter-[brightness(0)]"
              />
            )}
            {usuarioLogado && (
              <span className="text-[11px] font-bold text-[#1B1B2F] truncate max-w-full block">
                {usuarioLogado.nomeUsuario}
              </span>
            )}
          </button>
        </div>

        <button
          className={`cursor-pointer transition-all duration-300 hover:rotate-90 active:scale-90 filter-[brightness(0)] ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img
            src={SettingsImg}
            alt="Configurações"
            className="w-[35px] h-[35px]"
          />
        </button>
      </div>

      <div className="absolute right-[25%] top-1/2 -translate-y-1/2 select-none pointer-events-none z-10">
        <img
          src={LogoImg}
          alt="Logo"
          className="w-[480px] h-[480px] object-contain"
        />
        {usuarioLogado && (
          <div className="text-center font-bold text-[#C8911A] text-[20px] tracking-wide mt-2">
            Bem-vindo, {usuarioLogado.nomeUsuario}! ({usuarioLogado.moedas}G)
          </div>
        )}
      </div>

      <div className="absolute bottom-8 -right-2 z-10">
        <MenuButton
          text="Loja"
          iconSrc={ShoppingCartImg}
          backgroundColor="bg-[#C8911A]"
          contentColor="text-black"
          width="w-[200px]"
        />
      </div>

      <div
        className={`absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-[#21366B]/95 border-2 border-[#C8911A] p-2 rounded-xl transition-all duration-300 shadow-lg
          ${isHovered ? "translate-x-[95px]" : "translate-x-0"}`}
      >
        <span
          className={`w-3 h-3 rounded-full ${isServerConnected ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"}`}
        />
        <label className="text-[12px] font-bold text-[#C8911A] uppercase tracking-wider">
          API IP:
        </label>
        <input
          type="text"
          value={serverIp}
          onChange={(e) => setServerIp(e.target.value)}
          placeholder="Ex: 192.168.1.50:5262"
          className="bg-[#1B1B2F] text-white font-mono text-[14px] px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-[#C8911A] w-[180px]"
        />
        <button
          onClick={() => testConnection(false)}
          className="bg-[#C8911A] text-black font-bold text-[12px] px-3 py-1 rounded-md cursor-pointer hover:brightness-110 active:scale-95 transition-all"
        >
          Testar
        </button>
      </div>

      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1c1c32] border border-[#C8911A]/40 rounded-2xl max-w-4xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthMessage({ text: "", isError: false });
              }}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold z-50 bg-black/40 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {usuarioLogado ? (
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="h-48 w-full bg-[#141423] relative shrink-0">
                  {usuarioLogado.banner ? (
                    <img
                      src={usuarioLogado.banner}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-r from-[#21366B] to-[#1B1B2F]" />
                  )}
                  <div className="absolute -bottom-12 left-8 flex items-end gap-4">
                    <div className="w-24 h-24 rounded-full border-4 border-[#1c1c32] bg-[#21366B] overflow-hidden shrink-0 shadow-lg">
                      {usuarioLogado.fotoPerfil ? (
                        <img
                          src={usuarioLogado.fotoPerfil}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold uppercase">
                          {usuarioLogado.nomeUsuario.substring(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="mb-2">
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">
                        {usuarioLogado.nomeUsuario}
                      </h3>
                      <span className="bg-[#C8911A] text-black text-[11px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                        Jogador Ativo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-16 p-8 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                  <div className="md:col-span-2 space-y-4">
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
                          onClick={handleSaveCustomization}
                          className="bg-[#21366B] hover:brightness-110 text-white font-bold text-xs py-2 px-4 rounded transition-all cursor-pointer"
                        >
                          Salvar Customização
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-[#141423] p-4 rounded-lg border border-white/5 space-y-3 text-sm">
                      <h4 className="text-[#C8911A] font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-1">
                        Estatísticas
                      </h4>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Pontos de Ranking:
                        </span>
                        <span className="font-mono text-green-400 font-bold">
                          {usuarioLogado.pontos} P
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Moedas:</span>
                        <span className="font-mono text-yellow-400 font-bold">
                          {usuarioLogado.moedas}G
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600/20 hover:bg-red-600 border border-red-600/40 text-white font-bold py-2 rounded transition-all text-sm cursor-pointer"
                    >
                      Sair da Conta
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 max-w-md mx-auto w-full py-16">
                <h3 className="text-center text-[#C8911A] text-[28px] font-bold mb-6">
                  {isRegisterMode ? "Criar Conta" : "Entrar"}
                </h3>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
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
              </div>
            )}
          </div>
        </div>
      )}

      {isRankingModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1B1B2F] border-2 border-[#C8911A] rounded-[20px] max-w-2xl w-full p-6 shadow-2xl relative h-[80vh] flex flex-col">
            <button
              onClick={() => setIsRankingModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center justify-center gap-2 mb-4">
              <img src={IconRankingImg} alt="" className="w-8 h-8" />
              <h3 className="text-[#C8911A] text-[28px] font-bold">
                Classificação Global
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
                        className="flex p-3 text-center items-center hover:bg-[#21366B]/20 transition-colors"
                      >
                        <span className={`w-16 ${colorClass}`}>
                          {position}º
                        </span>
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
      )}
    </div>
  );
}

export default MainMenuPage;
