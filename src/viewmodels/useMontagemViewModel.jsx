import { useState } from "react";
import { apiService } from "../services/api";

function getNomeCarta(item) {
  return (
    item?.carta?.nome ||
    item?.carta?.Nome ||
    item?.Carta?.nome ||
    item?.Carta?.Nome ||
    "Carta"
  );
}

function getTipoCarta(item) {
  return (
    item?.carta?.tipo ||
    item?.carta?.Tipo ||
    item?.Carta?.tipo ||
    item?.Carta?.Tipo ||
    ""
  );
}

export function useMontagemViewModel() {
  const [nomeBaralho, setNomeBaralho] = useState("");
  const [inventarioFull, setInventarioFull] = useState([]);
  const [itensNoBaralho, setItensNoBaralho] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const carregarDados = async (idBaralho, userId) => {
    setIsLoading(true);
    try {
      const baseUrl = apiService.getBaseUrl();

      const [invRes, baralhosData] = await Promise.all([
        fetch(`${baseUrl}/inventario`).then((r) => r.json()),
        apiService.listarBaralhos(userId),
      ]);

      const meusItens = (invRes || []).filter(
        (item) =>
          (item.idUsuario ?? item.IdUsuario) === userId
      );
      setInventarioFull(meusItens);

      const baralhoAtual = baralhosData.find(
        (b) => b.idBaralho === idBaralho
      );
      if (baralhoAtual) {
        setNomeBaralho(baralhoAtual.nome);
        setItensNoBaralho(baralhoAtual.Inventarios || baralhoAtual.inventarios || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarCarta = (item) => {
    const idInv = item.idInventario ?? item.IdInventario;
    const jaAdicionado = itensNoBaralho.some(
      (i) => (i.idInventario ?? i.IdInventario) === idInv
    );
    if (!jaAdicionado) {
      setItensNoBaralho((prev) => [...prev, item]);
    }
  };

  const removerCarta = (item) => {
    const idInv = item.idInventario ?? item.IdInventario;
    setItensNoBaralho((prev) =>
      prev.filter((i) => (i.idInventario ?? i.IdInventario) !== idInv)
    );
  };

  const salvar = async (idBaralho, userId, onSucesso, onErro) => {
    try {
      const payload = {
        idBaralho,
        nome: nomeBaralho,
        idUsuario: userId,
        inventarios: itensNoBaralho.map((item) => ({
          idInventario: item.idInventario ?? item.IdInventario,
          idUsuario: item.idUsuario ?? item.IdUsuario ?? userId,
          idCarta: item.idCarta ?? item.IdCarta ?? 0,
        })),
      };
      await apiService.atualizarBaralho(idBaralho, payload);
      onSucesso?.();
    } catch (e) {
      onErro?.();
    }
  };

  return {
    nomeBaralho,
    setNomeBaralho,
    inventarioFull,
    itensNoBaralho,
    isLoading,
    carregarDados,
    adicionarCarta,
    removerCarta,
    salvar,
    getNomeCarta,
    getTipoCarta,
  };
}
