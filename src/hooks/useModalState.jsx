import { useState, useEffect } from "react";

export function useModalState() {
  const [isHovered, setIsHovered] = useState(false);
  const [uiScale, setUiScale] = useState(
    () => localStorage.getItem("cardgame_ui_scale") || "100"
  );
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [perfilVisualizado, setPerfilVisualizado] = useState(null);

  useEffect(() => {
    localStorage.setItem("cardgame_ui_scale", uiScale);
  }, [uiScale]);

  const resetModals = () => {
    setPerfilVisualizado(null);
    setIsProfilePopoverOpen(false);
    setIsAuthModalOpen(false);
    setIsRankingModalOpen(false);
    setIsProfileModalOpen(false);
    setIsSettingsModalOpen(false);
  };

  return {
    isHovered,
    setIsHovered,
    uiScale,
    setUiScale,
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
    resetModals,
  };
}
