import { useState, useEffect } from "react";
import { apiService } from "../services/api.jsx";

export function useMenuViewModel() {
  const [isHovered, setIsHovered] = useState(false);
  const [serverIp, setServerIpState] = useState(apiService.serverIp);
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

  const testConnection = async (silent = false) => {
    try {
      const conectado = await apiService.testConnection();
      setIsServerConnected(conectado);
      if (conectado && !silent) alert("Conectado com sucesso ao servidor!");
      return conectado;
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
    apiService.setServerIp(serverIp);
    testConnection(true);
  }, [serverIp]);

  const loadRanking = async () => {
    if (!isServerConnected) return;
    try {
      const data = await apiService.getRanking();
      setRankingList(data);
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

    try {
      if (isRegisterMode) {
        await apiService.registrar(usernameInput, passwordInput);
        setAuthMessage({
          text: "Usuário cadastrado com sucesso! Mude para Entrar.",
          isError: false,
        });
      } else {
        const data = await apiService.login(usernameInput, passwordInput);
        setUsuarioLogado(data);
        localStorage.setItem("cardgame_user", JSON.stringify(data));
        setIsAuthModalOpen(false);
        setUsernameInput("");
        setPasswordInput("");
      }
    } catch (err) {
      if (isRegisterMode) {
        setAuthMessage({
          text: "Nome de usuário já existe, ou senha muito curta.",
          isError: true,
        });
      } else {
        setAuthMessage({
          text: "Usuário ou senha incorretos ou erro no servidor.",
          isError: true,
        });
      }
    }
  };

  const handleSaveCustomization = async () => {
    if (!usuarioLogado || !isServerConnected) return;

    try {
      const usuarioAtualizado = await apiService.customizar(
        usuarioLogado.idUsuario,
        avatarUrl,
        bannerUrl,
      );
      setUsuarioLogado(usuarioAtualizado);
      setPerfilVisualizado(usuarioAtualizado);
      localStorage.setItem("cardgame_user", JSON.stringify(usuarioAtualizado));
      alert("Customização salva com sucesso no banco de dados!");
      loadRanking();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar customização.");
    }
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    setPerfilVisualizado(null);
    setIsProfileModalOpen(false);
    localStorage.removeItem("cardgame_user");
  };

  return {
    isHovered,
    setIsHovered,
    serverIp,
    setServerIpState,
    isServerConnected,
    usuarioLogado,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isRankingModalOpen,
    setIsRankingModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    perfilVisualizado,
    setPerfilVisualizado,
    isRegisterMode,
    setIsRegisterMode,
    usernameInput,
    setUsernameInput,
    passwordInput,
    setPasswordInput,
    authMessage,
    setAuthMessage,
    rankingList,
    avatarUrl,
    setAvatarUrl,
    bannerUrl,
    setBannerUrl,
    testConnection,
    handleAuthSubmit,
    handleSaveCustomization,
    handleLogout,
  };
}
