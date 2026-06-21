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
  const [baralhosUsuario, setBaralhosUsuario] = useState([]);
  const [cartaSelecionada, setCartaSelecionada] = useState(null);
  const [isLoadingInventario, setIsLoadingInventario] = useState(false);
  const [isInventarioOpen, setIsInventarioOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const showNotification = (text, type = "info", duration = 3000) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [
      { id, text, type, persistent: false },
      ...prev,
    ]);
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }
    return id;
  };

  const showPersistentNotification = (text, type = "info") => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [{ id, text, type, persistent: true }, ...prev]);
    return id;
  };

  const updateNotification = (id, newText, newType, duration = 3000) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, text: newText, type: newType, persistent: duration === 0 }
          : n,
      ),
    );
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const testConnection = async (silent = false) => {
    let notifId = null;
    if (!silent) {
      notifId = showPersistentNotification(
        "Conectando com o Servidor...",
        "loading",
      );
    }
    try {
      const conectado = await apiService.testConnection();
      setIsServerConnected(conectado);
      if (!silent) {
        if (conectado) {
          updateNotification(
            notifId,
            "Conectado com o servidor com sucesso!",
            "success",
            3000,
          );
        } else {
          updateNotification(
            notifId,
            "Não foi possível conectar a esse IP.",
            "error",
            4000,
          );
        }
      }
      return conectado;
    } catch (err) {
      setIsServerConnected(false);
      if (!silent && notifId) {
        updateNotification(
          notifId,
          "Erro crítico na conexão com a API.",
          "error",
          4000,
        );
      }
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

  const loadInventarioEBaralhos = async () => {
    if (!usuarioLogado || !isServerConnected) return;
    setIsLoadingInventario(true);
    try {
      const baseUrl = apiService.getBaseUrl();
      const baralhosRes = await fetch(
        `${baseUrl}/baralhos/${usuarioLogado.idUsuario}`,
      );
      let itensBloqueadosNosBaralhos = [];

      if (baralhosRes.ok) {
        const baralhosData = await baralhosRes.json();
        setBaralhosUsuario(baralhosData);
        baralhosData.forEach((b) => {
          if (b.inventarios) {
            b.inventarios.forEach((inv) => {
              itensBloqueadosNosBaralhos.push(inv.idInventario);
            });
          }
        });
      }

      const res = await fetch(`${baseUrl}/inventario`);
      if (res.ok) {
        const data = await res.json();
        const meusItensDoBanco = (data || []).filter(
          (item) => item && item.idUsuario === usuarioLogado.idUsuario,
        );
        const minhasCartasCompletas = meusItensDoBanco.map((item) => {
          return {
            idInventario: item.idInventario,
            idCarta: item.carta?.idCarta || item.idCarta,
            nome: item.carta?.nome || "Carta Desconhecida",
            tipo: item.carta?.tipo || "Desconhecido",
            raridade: item.carta?.raridade || "Comum",
            precoPadrao:
              item.carta?.precoPadrao || item.carta?.precopadrao || 0,
            vida: item.carta?.vida || null,
            acao1: item.carta?.acao1 || null,
            acao2: item.carta?.acao2 || null,
            estaEmBaralho: itensBloqueadosNosBaralhos.includes(
              item.idInventario,
            ),
          };
        });
        setInventarioCartas(minhasCartasCompletas);
      }
    } catch (err) {
      console.error("Erro ao carregar banco de dados:", err);
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
        loadInventarioEBaralhos();
      }
    }
  }, [usuarioLogado, isProfileModalOpen, isInventarioOpen, isServerConnected]);

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
        showNotification("Usuário cadastrado com sucesso!", "success", 3000);
      } else {
        const data = await apiService.login(usernameInput, passwordInput);
        const completo = await apiService.getUsuarioById(data.idUsuario);
        setUsuarioLogado(completo);
        localStorage.setItem("cardgame_user", JSON.stringify(completo));
        setIsAuthModalOpen(false);
        setUsernameInput("");
        setPasswordInput("");
        showNotification(
          `Bem-vindo de volta, ${completo.nomeUsuario}!`,
          "success",
          3000,
        );
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
      showNotification("Customização salva com sucesso!", "success", 3000);
      loadRanking();
    } catch (err) {
      console.error(err);
      showNotification("Erro ao salvar customização.", "error", 4000);
    }
  };

  const handleVenderCarta = async (carta) => {
    if (!usuarioLogado || !isServerConnected) return;
    if (carta.estaEmBaralho) {
      showNotification(
        "Não é possível vender esta carta! Remova-a dos Baralhos.",
        "error",
        4000,
      );
      return;
    }
    const valorVenda = Math.floor(carta.precoPadrao * 0.5);
    const novoSaldoMoedas = usuarioLogado.moedas + valorVenda;
    try {
      const baseUrl = apiService.getBaseUrl();
      const res = await fetch(`${baseUrl}/inventario/${carta.idInventario}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetch(`${baseUrl}/usuarios/customizar`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idUsuario: usuarioLogado.idUsuario,
            fotoPerfil: usuarioLogado.fotoPerfil,
            banner: usuarioLogado.banner,
            moedas: novoSaldoMoedas,
          }),
        });
        const completo = await apiService.getUsuarioById(
          usuarioLogado.idUsuario,
        );
        if (completo.moedas !== novoSaldoMoedas) {
          completo.moedas = novoSaldoMoedas;
        }
        setUsuarioLogado(completo);
        localStorage.setItem("cardgame_user", JSON.stringify(completo));
        setCartaSelecionada(null);
        loadInventarioEBaralhos();
        showNotification(
          `Carta vendida com sucesso por +${valorVenda}G!`,
          "success",
          3000,
        );
      } else {
        showNotification(
          "Erro ao processar a venda no servidor.",
          "error",
          4000,
        );
      }
    } catch (err) {
      console.error(err);
      showNotification("Falha na conexão ao vender a carta.", "error", 4000);
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
    setBaralhosUsuario([]);
    localStorage.removeItem("cardgame_user");
    showNotification("Sessão encerrada com sucesso.", "info", 3000);
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
      showNotification("Conta deletada com sucesso.", "success", 4000);
      handleLogout();
    } catch (err) {
      showNotification("Erro ao deletar conta do servidor.", "error", 4000);
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
    notifications,
    dismissNotification,
  };
}
