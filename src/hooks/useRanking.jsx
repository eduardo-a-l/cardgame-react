import { useState, useEffect } from "react";
import { apiService } from "../services/api.jsx";

export function useRanking(
  isServerConnected,
  isRankingModalOpen,
  setPerfilVisualizado,
  setIsProfileModalOpen
) {
  const [rankingList, setRankingList] = useState([]);

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

  const handleSelectUserFromRanking = async (playerSummary) => {
    try {
      const usuarioCompleto = await apiService.getUsuarioById(
        playerSummary.idUsuario
      );
      setPerfilVisualizado(usuarioCompleto);
      setIsProfileModalOpen(true);
    } catch (err) {
      setPerfilVisualizado(playerSummary);
      setIsProfileModalOpen(true);
    }
  };

  return {
    rankingList,
    loadRanking,
    handleSelectUserFromRanking,
  };
}
