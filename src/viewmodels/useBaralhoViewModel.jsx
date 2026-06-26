import { useState } from "react";
import { apiService } from "../services/api";

export function useBaralhoViewModel() {
  const [baralhos, setBaralhos] = useState([]);

  const carregar = async (userId) => {
    try {
      const data = await apiService.listarBaralhos(userId);
      setBaralhos(data);
    } catch (e) {}
  };

  const criar = async (userId) => {
    try {
      const novo = await apiService.criarBaralho(userId);
      setBaralhos((prev) => [...prev, novo]);
    } catch (e) {}
  };

  const excluir = async (id) => {
    try {
      const sucesso = await apiService.excluirBaralho(id);
      if (sucesso) {
        setBaralhos((prev) => prev.filter((b) => b.idBaralho !== id));
      }
    } catch (e) {}
  };

  return { baralhos, carregar, criar, excluir };
}
