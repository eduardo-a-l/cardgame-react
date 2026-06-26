import { useState } from "react";
import { apiService } from "../services/api";

export function useMontagemViewModel() {
  const [nomeBaralho, setNomeBaralho] = useState("");
  const [inventarioFull, setInventarioFull] = useState([]);
  const [itensNoBaralho, setItensNoBaralho] = useState([]);

  const carregarDados = async (idBaralho, userId) => {
    try {
      const invRes = await apiService.listarInventario();
      const meusItens = invRes.filter((item) => item.idUsuario === userId);
      setInventarioFull(meusItens);

      const baralhos = await apiService.listarBaralhos(userId);
      const baralhoAtual = baralhos.find((b) => b.idBaralho === idBaralho);
      if (baralhoAtual) {
        setNomeBaralho(baralhoAtual.nome);
        setItensNoBaralho(baralhoAtual.inventarios || []);
      }
    } catch (e) {}
  };

  const adicionarCarta = (item) => {
    const jaAdicionado = itensNoBaralho.some(
      (i) => i.idInventario === item.idInventario,
    );
    if (!jaAdicionado) {
      setItensNoBaralho((prev) => [...prev, item]);
    }
  };

  const removerCarta = (item) => {
    setItensNoBaralho((prev) =>
      prev.filter((i) => i.idInventario !== item.idInventario),
    );
  };

  const salvar = async (idBaralho, userId, onSucesso) => {
    if (itensNoBaralho.length === 0) {
      alert("Coloque ao menos uma carta no baralho!");
      return;
    }
    try {
      const baralho = {
        idBaralho,
        nome: nomeBaralho,
        idUsuario: userId,
        inventarios: itensNoBaralho,
      };
      const sucesso = await apiService.atualizarBaralho(idBaralho, baralho);
      if (sucesso) {
        onSucesso();
      }
    } catch (e) {}
  };

  return {
    nomeBaralho,
    setNomeBaralho,
    inventarioFull,
    itensNoBaralho,
    carregarDados,
    adicionarCarta,
    removerCarta,
    salvar,
  };
}
