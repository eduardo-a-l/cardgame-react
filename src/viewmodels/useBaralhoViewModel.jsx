import { useState } from "react";
import { apiService } from "../services/api";

export function useBaralhoViewModel() {
  const [baralhos, setBaralhos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const carregar = async (userId) => {
    setIsLoading(true);
    try {
      const data = await apiService.listarBaralhos(userId);
      setBaralhos(Array.isArray(data) ? data : []);
    } catch (e) {
      setBaralhos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const criar = async (userId) => {
    try {
      const novo = await apiService.criarBaralho(userId);
      setBaralhos((prev) => [...prev, novo]);
      return novo;
    } catch (e) {
      return null;
    }
  };

  const excluir = async (id) => {
    try {
      await apiService.excluirBaralho(id);
      setBaralhos((prev) => prev.filter((b) => b.idBaralho !== id));
      return true;
    } catch (e) {
      return false;
    }
  };

  return { baralhos, isLoading, carregar, criar, excluir };
}
