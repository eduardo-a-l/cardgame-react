import { ComponentProps } from "react";
import { Icone, NomeIcone } from "./Icone";

interface BotaoProps extends ComponentProps<"button"> {
  texto?: string;
  nomeIcone?: NomeIcone;
  corDeFundo?: string;
  corDaBorda?: string;
  corDoTexto?: string;
}

export function Botao({
  texto,
  nomeIcone,
  corDeFundo = "#21366B",
  corDaBorda = "#C8911A",
  corDoTexto = "#FFFFFF",
  className = "",
  style,
  ...props
}: BotaoProps) {
  return (
    <button
      style={{
        backgroundColor: corDeFundo,
        color: corDoTexto,
        borderColor: corDaBorda,
        ...style,
      }}
      className={`flex items-center gap-3 px-5 py-2.5 border-2 rounded-xl ${className}`}
      {...props}
    >
      {nomeIcone && <Icone nome={nomeIcone} tamanho={20} />}
      {texto && <span>{texto}</span>}
    </button>
  );
}
