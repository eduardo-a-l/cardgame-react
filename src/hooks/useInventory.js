import { useState, useEffect } from "react";
import { apiService } from "../services/api.jsx";

export function useInventory(
  usuarioLogado,
  setUsuarioLogado,
  isServerConnected,
  showNotification,
  openAuthModalWithMode
) {
  const [inventarioCartas, setInventarioCartas] = useState([]);
  const [baralhosUsuario, setBaralhosUsuario] = useState([]);
  const [cartaSelecionada, setCartaSelecionada] = useState(null);
  const [isLoadingInventario, setIsLoadingInventario] = useState(false);
  const [isInventarioOpen, setIsInventarioOpen] = useState(false);

  const loadInventarioEBaralhos = async () => {
    if (!usuarioLogado || !isServerConnected) return;
    setIsLoadingInventario(true);
    try {
      const baseUrl = apiService.getBaseUrl();
      const baralhosRes = await fetch(
        `${baseUrl}/baralhos/${usuarioLogado.idUsuario}`
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
          (item) => item && item.idUsuario === usuarioLogado.idUsuario
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
              item.idInventario
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
    if (usuarioLogado && isInventarioOpen) {
      loadInventarioEBaralhos();
    }
  }, [usuarioLogado, isInventarioOpen, isServerConnected]);

  const handleVenderCarta = async (carta) => {
    if (!usuarioLogado || !isServerConnected) return;
    if (carta.estaEmBaralho) {
      showNotification(
        "Não é possível vender esta carta! Remova-a dos Baralhos.",
        "error",
        4000
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
          usuarioLogado.idUsuario
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
          3000
        );
      } else {
        showNotification(
          "Erro ao processar a venda no servidor.",
          "error",
          4000
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

  const resetInventory = () => {
    setCartaSelecionada(null);
    setInventarioCartas([]);
    setBaralhosUsuario([]);
  };

  return {
    inventarioCartas,
    baralhosUsuario,
    cartaSelecionada,
    setCartaSelecionada,
    isLoadingInventario,
    isInventarioOpen,
    setIsInventarioOpen,
    handleVenderCarta,
    handleOpenInventarioClick,
    resetInventory,
  };
}
