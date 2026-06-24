import { useState, useEffect } from "react";
import { apiService } from "../services/api.jsx";

export function useAuth(
  isServerConnected,
  showNotification,
  loadRanking,
  setPerfilVisualizado,
  setIsProfileModalOpen,
  setIsAuthModalOpen,
  isProfileModalOpen
) {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem("cardgame_user");
    return salvo ? JSON.parse(salvo) : null;
  });

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authMessage, setAuthMessage] = useState({ text: "", isError: false });

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  useEffect(() => {
    if (usuarioLogado) {
      setAvatarUrl(usuarioLogado.fotoPerfil || "");
      setBannerUrl(usuarioLogado.banner || "");
    }
  }, [usuarioLogado, isProfileModalOpen]);

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
          3000
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
        bannerUrl
      );
      const completo = await apiService.getUsuarioById(
        usuarioAtualizado.idUsuario
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

  const logout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem("cardgame_user");
  };

  const handleDeleteAccount = async (onLogoutSuccess) => {
    if (!usuarioLogado) return;
    if (
      !window.confirm(
        "ATENÇÃO: Tem certeza que deseja deletar sua conta permanentemente? Todos os seus baralhos e inventário serão apagados."
      )
    ) {
      return;
    }
    try {
      await apiService.deletarConta(usuarioLogado.idUsuario);
      showNotification("Conta deletada com sucesso.", "success", 4000);
      onLogoutSuccess();
    } catch (err) {
      showNotification("Erro ao deletar conta do servidor.", "error", 4000);
    }
  };

  return {
    usuarioLogado,
    setUsuarioLogado,
    isRegisterMode,
    setIsRegisterMode,
    usernameInput,
    setUsernameInput,
    passwordInput,
    setPasswordInput,
    authMessage,
    setAuthMessage,
    avatarUrl,
    setAvatarUrl,
    bannerUrl,
    setBannerUrl,
    openAuthModalWithMode,
    handleAuthSubmit,
    handleSaveCustomization,
    logout,
    handleDeleteAccount,
  };
}
