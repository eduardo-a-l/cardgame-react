import { useState, useEffect } from "react";
import { apiService } from "../services/api.jsx";

export function useMenuViewModel() {
  const [isHovered, setIsHovered] = useState(false);
  const [serverIp, setServerIpState] = useState(apiService.serverIp);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [uiScale, setUiScale] = useState(
    () => localStorage.getItem("cardgame_ui_scale") || "100",
  );

  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem("cardgame_user");
    return salvo ? JSON.parse(salvo) : null;
  });

  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [perfilVisualizado, setPerfilVisualizado] = useState(null);

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authMessage, setAuthMessage] = useState({ text: "", isError: false });
  const [rankingList, setRankingList] = useState([]);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const [inventarioCartas, setInventarioCartas] = useState([]);
  const [cartaSelecionada, setCartaSelecionada] = useState(null);
  const [isLoadingInventario, setIsLoadingInventario] = useState(false);
  const [isInventarioOpen, setIsInventarioOpen] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("cardgame_ui_scale", uiScale);
  }, [uiScale]);

  const loadRanking = async () => {
    if (!isServerConnected) return;
    try {
      const data = await apiService.getRanking();
      setRankingList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadInventario = async () => {
    if (!usuarioLogado || !isServerConnected) return;
    setIsLoadingInventario(true);
    try {
      const baseUrl = apiService.getBaseUrl();
      const res = await fetch(`${baseUrl}/inventarios`);
      if (res.ok) {
        const data = await res.json();
        const meusItens = data.filter(
          (item) => item.idUsuario === usuarioLogado.idUsuario,
        );

        const cartasRes = await fetch(`${baseUrl}/cartas`);
        if (cartasRes.ok) {
          const todasCartas = await cartasRes.json();
          const minhasCartasCompletas = meusItens
            .map((item) => {
              const dadosCarta = todasCartas.find(
                (c) => c.idCarta === item.idCarta,
              );
              return { ...dadosCarta, idInventario: item.idInventario };
            })
            .filter((c) => c.idCarta);

          setInventarioCartas(minhasCartasCompletas);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingInventario(false);
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
      if (isInventarioOpen) {
        loadInventario();
      }
    }
  }, [usuarioLogado, isProfileModalOpen, isInventarioOpen]);

  const handleSelectUserFromRanking = async (playerSummary) => {
    try {
      const usuarioCompleto = await apiService.getUsuarioById(
        playerSummary.idUsuario,
      );
      setPerfilVisualizado(usuarioCompleto);
      setIsProfileModalOpen(true);
    } catch (err) {
      setPerfilVisualizado(playerSummary);
      setIsProfileModalOpen(true);
    }
  };

  const openAuthModalWithMode = (registerMode) => {
    setIsRegisterMode(registerMode);
    setIsAuthModalOpen(true);
  };

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
        const completo = await apiService.getUsuarioById(data.idUsuario);
        setUsuarioLogado(completo);
        localStorage.setItem("cardgame_user", JSON.stringify(completo));
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
      const completo = await apiService.getUsuarioById(
        usuarioAtualizado.idUsuario,
      );
      setUsuarioLogado(completo);
      setPerfilVisualizado(completo);
      localStorage.setItem("cardgame_user", JSON.stringify(completo));
      alert("Customização salva com sucesso!");
      loadRanking();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar customização.");
    }
  };

  const handleVenderCarta = async (carta) => {
    if (!usuarioLogado || !isServerConnected) return;
    const valorVenda = Math.floor(carta.precoPadrao * 0.5);

    try {
      const baseUrl = apiService.getBaseUrl();
      const res = await fetch(
        `${baseUrl}/inventarios/${carta.idInventario || carta.idCarta}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        const novoSaldoMoedas = usuarioLogado.moedas + valorVenda;

        const updateRes = await fetch(`${baseUrl}/usuarios/customizar`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idUsuario: usuarioLogado.idUsuario,
            fotoPerfil: usuarioLogado.fotoPerfil,
            banner: usuarioLogado.banner,
          }),
        });

        const completo = await apiService.getUsuarioById(
          usuarioLogado.idUsuario,
        );
        completo.moedas = novoSaldoMoedas;
        setUsuarioLogado(completo);
        localStorage.setItem("cardgame_user", JSON.stringify(completo));

        setCartaSelecionada(null);
        loadInventario();
        alert(`Carta vendida com sucesso por +${valorVenda}G!`);
      } else {
        alert("Erro ao processar a venda no servidor.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha na conexão ao vender a carta.");
    }
  };

  const handleOpenInventarioClick = () => {
    if (!usuarioLogado) {
      openAuthModalWithMode(false);
    } else {
      setIsInventarioOpen(true);
    }
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    setPerfilVisualizado(null);
    setIsProfileModalOpen(false);
    setIsSettingsModalOpen(false);
    setIsProfilePopoverOpen(false);
    setIsInventarioOpen(false);
    setCartaSelecionada(null);
    setInventarioCartas([]);
    localStorage.removeItem("cardgame_user");
  };

  const handleDeleteAccount = async () => {
    if (!usuarioLogado) return;
    if (
      !window.confirm(
        "ATENÇÃO: Tem certeza que deseja deletar sua conta permanentemente? Todos os seus baralhos e inventário serão apagados.",
      )
    )
      return;

    try {
      await apiService.deletarConta(usuarioLogado.idUsuario);
      alert("Conta deletada com sucesso.");
      handleLogout();
    } catch (err) {
      alert("Erro ao deletar conta do servidor.");
    }
  };

  return {
    isHovered,
    setIsHovered,
    serverIp,
    setServerIpState,
    isServerConnected,
    uiScale,
    setUiScale,
    usuarioLogado,
    isProfilePopoverOpen,
    setIsProfilePopoverOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isRankingModalOpen,
    setIsRankingModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
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
    inventarioCartas,
    cartaSelecionada,
    setCartaSelecionada,
    isLoadingInventario,
    isInventarioOpen,
    setIsInventarioOpen,
    testConnection,
    handleSelectUserFromRanking,
    openAuthModalWithMode,
    handleAuthSubmit,
    handleSaveCustomization,
    handleVenderCarta,
    handleOpenInventarioClick,
    handleLogout,
    handleDeleteAccount,
  };
}
