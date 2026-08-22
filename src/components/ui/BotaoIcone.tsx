import { ComponentProps } from "react";
import { Icone, NomeIcone } from "./Icone";

interface BotaoIconeProps extends ComponentProps<"button"> {
  nomeIcone: NomeIcone;
  tamanhoIcone?: number;
}

export function BotaoIcone({
  nomeIcone,
  tamanhoIcone = 24,
  className = "",
  ...props
}: BotaoIconeProps) {
  return (
    <button className={className} {...props}>
      <Icone nome={nomeIcone} tamanho={tamanhoIcone} />
    </button>
  );
}
