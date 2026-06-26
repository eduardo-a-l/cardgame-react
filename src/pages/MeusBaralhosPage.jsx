import { useEffect, useState } from "react";
import { useBaralhoViewModel } from "../viewmodels/useBaralhoViewModel";
import MenuButton from "../components/MenuButton";
import ArrowLeftCircleImg from "../assets/Arrow left-circle.svg";

function MeusBaralhosPage({ onClose, onEditarBaralho, idUsuarioLogado }) {
  const viewModel = useBaralhoViewModel();
  const [idSelecionado, setIdSelecionado] = useState(null);

  useEffect(() => {
    viewModel.carregar(idUsuarioLogado);
  }, [idUsuarioLogado]);

  return (
    <div className="fixed inset-0 bg-[#1B1B2F] z-50 flex flex-col p-6 items-center select-none overflow-hidden">
      <div className="w-full flex items-center justify-between border-b border-[#C8911A]/30 pb-4 mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 cursor-pointer text-white text-lg font-semibold hover:scale-105 transition-transform"
        >
          <img src={ArrowLeftCircleImg} alt="Voltar" className="w-8 h-8" />
          <span>Voltar</span>
        </button>
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Meus Baralhos
        </h1>
        <div className="w-24" />
      </div>

      <div className="flex-1 w-full max-w-5xl bg-[#141423]/80 border border-[#C8911A]/40 rounded-2xl p-6 mb-6 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {viewModel.baralhos.map((baralho) => {
            const isSelected = idSelecionado === baralho.idBaralho;
            return (
              <div
                key={baralho.idBaralho}
                onClick={() => setIdSelecionado(baralho.idBaralho)}
                className={`aspect-[3/4] rounded-xl border-2 p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-[#C8911A] border-white scale-105 shadow-lg shadow-[#C8911A]/30"
                    : "bg-[#21366B] border-[#C8911A] hover:scale-102"
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span
                    className={`font-bold text-center text-sm break-words ${isSelected ? "text-slate-900" : "text-white"}`}
                  >
                    {baralho.nome}
                  </span>
                  <span
                    className={`text-xs mt-2 ${isSelected ? "text-slate-800" : "text-slate-400"}`}
                  >
                    {baralho.inventarios?.length || 0} cartas
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-6">
          <MenuButton
            text="Editar"
            width="w-[180px]"
            height="h-[50px]"
            fontSize="text-[18px]"
            onClick={() => {
              if (idSelecionado) onEditarBaralho(idSelecionado);
            }}
          />
          <MenuButton
            text="Excluir"
            width="w-[180px]"
            height="h-[50px]"
            fontSize="text-[18px]"
            onClick={() => {
              if (idSelecionado) {
                viewModel.excluir(idSelecionado);
                setIdSelecionado(null);
              }
            }}
          />
        </div>

        <MenuButton
          text="Criar novo"
          width="w-[220px]"
          height="h-[55px]"
          fontSize="text-[20px]"
          onClick={() => viewModel.criar(idUsuarioLogado)}
        />
      </div>
    </div>
  );
}

export default MeusBaralhosPage;
