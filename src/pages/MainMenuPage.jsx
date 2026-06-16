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

import AuthModal from "../components/modals/AuthModal";
import ProfileModal from "../components/modals/ProfileModal";
import RankingModal from "../components/modals/RankingModal";

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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [perfilVisualizado, setPerfilVisualizado] = useState(null);

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
  }, [usuarioLogado, isProfileModalOpen]);

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
        setPerfilVisualizado(usuarioAtualizado);
        localStorage.setItem(
          "cardgame_user",
          JSON.stringify(usuarioAtualizado),
        );

        alert("Customização salva com sucesso no banco de dados!");
        loadRanking();
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
    setPerfilVisualizado(null);
    setIsProfileModalOpen(false);
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
            className={`cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={IconRankingImg}
              alt="Ranking"
              className="w-[35px] h-[35px] brightness-0"
            />
          </button>

          <button
            onClick={() => {
              if (usuarioLogado) {
                setPerfilVisualizado(usuarioLogado);
                setIsProfileModalOpen(true);
              } else {
                setIsAuthModalOpen(true);
              }
            }}
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
                className="w-[35px] h-[35px] brightness-0"
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
          className={`cursor-pointer transition-all duration-300 hover:rotate-90 active:scale-90 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img
            src={SettingsImg}
            alt="Configurações"
            className="w-[35px] h-[35px] brightness-0"
          />
        </button>
      </div>

      <div className="absolute right-[25%] top-1/2 -translate-y-1/2 select-none pointer-events-none z-10">
        <img
          src={LogoImg}
          alt="Logo"
          className="w-[480px] h-[480px] object-contain"
        />
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isRegisterMode={isRegisterMode}
        setIsRegisterMode={setIsRegisterMode}
        usernameInput={usernameInput}
        setUsernameInput={setUsernameInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        authMessage={authMessage}
        setAuthMessage={setAuthMessage}
        onSubmit={handleAuthSubmit}
      />

      <RankingModal
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        isServerConnected={isServerConnected}
        rankingList={rankingList}
        onSelectPlayer={(player) => {
          setPerfilVisualizado(player);
          setIsProfileModalOpen(true);
        }}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        usuario={perfilVisualizado}
        usuarioLogado={usuarioLogado}
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
        bannerUrl={bannerUrl}
        setBannerUrl={setBannerUrl}
        rankingList={rankingList}
        onSaveCustomization={handleSaveCustomization}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default MainMenuPage;
