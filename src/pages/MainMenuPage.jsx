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
          ${isHovered ? "pl-[75px]" : "pl-[5px]"}`}
      >
        <MenuButton text="Jogar" iconSrc={PlayImg} />
        <MenuButton text="Inventário" iconSrc={PackageImg} />
        <MenuButton text="Baralhos" iconSrc={BaralhosImg} />
        <MenuButton text="Sair" iconSrc={ArrowLeftCircleImg} />
      </div>

      <div
        className={`absolute left-0 top-0 h-full w-[80px] bg-[#C8911A] flex flex-col justify-between items-center py-6 z-20 shadow-xl transition-all duration-300 ease-out
          ${isHovered ? "translate-x-0 pl-0" : "-translate-x-[68px] pl-[68px]"}`}
      >
        <div className="flex flex-col items-center gap-8 w-full transition-opacity duration-200">
          <button
            onClick={() => setIsRankingModalOpen(true)}
            className={`cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90 [filter:brightness(0)] ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={IconRankingImg}
              alt="Ranking"
              className="w-[35px] h-[35px]"
            />
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className={`cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90 [filter:brightness(0)] ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img src={UserImg} alt="Perfil" className="w-[35px] h-[35px]" />
          </button>
        </div>

        <button
          className={`cursor-pointer transition-all duration-300 hover:rotate-90 active:scale-90 [filter:brightness(0)] ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
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
        className={`absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-[#21366B]/95 border-2 border-[#C8911A] p-2 rounded-[12px] transition-all duration-300 shadow-lg
          ${isHovered ? "translate-x-[75px]" : "translate-x-0"}`}
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
          placeholder="Ex: 192.168.1.50:5000"
          className="bg-[#1B1B2F] text-white font-mono text-[14px] px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-[#C8911A] w-[180px]"
        />
        <button
          onClick={() => testConnection(false)}
          className="bg-[#C8911A] text-black font-bold text-[12px] px-3 py-1 rounded-[6px] cursor-pointer hover:brightness-110 active:scale-95 transition-all"
        >
          Testar
        </button>
      </div>

      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1B1B2F] border-2 border-[#C8911A] rounded-[20px] max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthMessage({ text: "", isError: false });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold transition-colors"
            >
              ✕
            </button>

            {usuarioLogado ? (
              <div className="text-center py-4">
                <h3 className="text-[#C8911A] text-[28px] font-bold mb-4">
                  Seu Perfil
                </h3>
                <div className="space-y-2 text-left bg-[#21366B]/40 p-4 rounded-[12px] border border-[#21366B] mb-6">
                  <p>
                    <span className="text-gray-400">Usuário:</span>{" "}
                    <strong className="text-white">
                      {usuarioLogado.nomeUsuario}
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray-400">
                      Pontos de Classificação:
                    </span>{" "}
                    <strong className="text-green-400">
                      {usuarioLogado.pontos} XP
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray-400">Moedas em Ouro:</span>{" "}
                    <strong className="text-yellow-400">
                      {usuarioLogado.moedas}G
                    </strong>
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-[8px] transition-all active:scale-95"
                >
                  Desconectar Conta
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-center text-[#C8911A] text-[28px] font-bold mb-6">
                  {isRegisterMode ? "Criar Conta" : "Acessar Sistema"}
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
                      className="w-full bg-[#21366B]/50 border border-gray-600 rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#C8911A]"
                      placeholder="Digite seu nickname"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Senha Secreta
                    </label>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-[#21366B]/50 border border-gray-600 rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#C8911A]"
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
                    className="w-full bg-[#C8911A] hover:brightness-110 text-black font-bold py-2 rounded-[8px] transition-all active:scale-95"
                  >
                    {isRegisterMode ? "Registrar Agora" : "Entrar no Jogo"}
                  </button>
                </form>

                <div className="mt-4 text-center text-sm">
                  <button
                    onClick={() => {
                      setIsRegisterMode(!isRegisterMode);
                      setAuthMessage({ text: "", isError: false });
                    }}
                    className="text-[#C8911A] hover:underline"
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
                  Insira um IP local válido no rodapé antes de acessar o
                  Ranking.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden border border-[#21366B] rounded-[8px]">
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
                        <span className="flex-1 text-left px-4 font-semibold">
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
