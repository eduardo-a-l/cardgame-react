import { useModalState } from "../hooks/useModalState.js";
import { useNotifications } from "../hooks/useNotifications.js";
import { useConnection } from "../hooks/useConnection.js";
import { useAuth } from "../hooks/useAuth.js";
import { useRanking } from "../hooks/useRanking.js";
import { useInventory } from "../hooks/useInventory.js";

export function useMenuViewModel() {
  const modalState = useModalState();
  const notifications = useNotifications();

  const connection = useConnection(
    notifications.showNotification,
    notifications.showPersistentNotification,
    notifications.updateNotification
  );

  const ranking = useRanking(
    connection.isServerConnected,
    modalState.isRankingModalOpen,
    modalState.setPerfilVisualizado,
    modalState.setIsProfileModalOpen
  );

  const auth = useAuth(
    connection.isServerConnected,
    notifications.showNotification,
    ranking.loadRanking,
    modalState.setPerfilVisualizado,
    modalState.setIsProfileModalOpen,
    modalState.setIsAuthModalOpen,
    modalState.isProfileModalOpen
  );

  const inventory = useInventory(
    auth.usuarioLogado,
    auth.setUsuarioLogado,
    connection.isServerConnected,
    notifications.showNotification,
    auth.openAuthModalWithMode
  );

  const handleLogout = () => {
    auth.logout();
    inventory.resetInventory();
    modalState.resetModals();
    notifications.showNotification("Sessão encerrada com sucesso.", "info", 3000);
  };

  const handleDeleteAccount = () => {
    auth.handleDeleteAccount(handleLogout);
  };

  return {
    isHovered: modalState.isHovered,
    setIsHovered: modalState.setIsHovered,
    serverIp: connection.serverIp,
    setServerIpState: connection.setServerIpState,
    isServerConnected: connection.isServerConnected,
    uiScale: modalState.uiScale,
    setUiScale: modalState.setUiScale,
    usuarioLogado: auth.usuarioLogado,
    isProfilePopoverOpen: modalState.isProfilePopoverOpen,
    setIsProfilePopoverOpen: modalState.setIsProfilePopoverOpen,
    isAuthModalOpen: modalState.isAuthModalOpen,
    setIsAuthModalOpen: modalState.setIsAuthModalOpen,
    isRankingModalOpen: modalState.isRankingModalOpen,
    setIsRankingModalOpen: modalState.setIsRankingModalOpen,
    isProfileModalOpen: modalState.isProfileModalOpen,
    setIsProfileModalOpen: modalState.setIsProfileModalOpen,
    isSettingsModalOpen: modalState.isSettingsModalOpen,
    setIsSettingsModalOpen: modalState.setIsSettingsModalOpen,
    perfilVisualizado: modalState.perfilVisualizado,
    setPerfilVisualizado: modalState.setPerfilVisualizado,
    isRegisterMode: auth.isRegisterMode,
    setIsRegisterMode: auth.setIsRegisterMode,
    usernameInput: auth.usernameInput,
    setUsernameInput: auth.setUsernameInput,
    passwordInput: auth.passwordInput,
    setPasswordInput: auth.setPasswordInput,
    authMessage: auth.authMessage,
    setAuthMessage: auth.setAuthMessage,
    rankingList: ranking.rankingList,
    avatarUrl: auth.avatarUrl,
    setAvatarUrl: auth.setAvatarUrl,
    bannerUrl: auth.bannerUrl,
    setBannerUrl: auth.setBannerUrl,
    inventarioCartas: inventory.inventarioCartas,
    cartaSelecionada: inventory.cartaSelecionada,
    setCartaSelecionada: inventory.setCartaSelecionada,
    isLoadingInventario: inventory.isLoadingInventario,
    isInventarioOpen: inventory.isInventarioOpen,
    setIsInventarioOpen: inventory.setIsInventarioOpen,
    testConnection: connection.testConnection,
    handleSelectUserFromRanking: ranking.handleSelectUserFromRanking,
    openAuthModalWithMode: auth.openAuthModalWithMode,
    handleAuthSubmit: auth.handleAuthSubmit,
    handleSaveCustomization: auth.handleSaveCustomization,
    handleVenderCarta: inventory.handleVenderCarta,
    handleOpenInventarioClick: inventory.handleOpenInventarioClick,
    handleLogout,
    handleDeleteAccount,
    notifications: notifications.notifications,
    dismissNotification: notifications.dismissNotification,
  };
}
