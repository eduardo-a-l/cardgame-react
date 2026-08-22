import IconeLeaderboard from "@/assets/icons/leaderboard.svg";
import IconeUsuario from "@/assets/icons/user.svg";
import IconeConfiguracoes from "@/assets/icons/settings.svg";
import IconeJogar from "@/assets/icons/play.svg";
import IconeInventario from "@/assets/icons/package.svg";
import IconeBaralho from "@/assets/icons/deck.svg";
import IconeLoja from "@/assets/icons/shop.svg";
import IconeVoltar from "@/assets/icons/back.svg";
import IconeNovo from "@/assets/icons/plus.svg";
import IconeParaBaixo from "@/assets/icons/down.svg";
import { ComponentProps } from "react";

const icones = {
  leaderboard: IconeLeaderboard,
  usuario: IconeUsuario,
  configuracoes: IconeConfiguracoes,
  jogar: IconeJogar,
  inventario: IconeInventario,
  baralho: IconeBaralho,
  loja: IconeLoja,
  voltar: IconeVoltar,
  novo: IconeNovo,
  paraBaixo: IconeParaBaixo,
};

export type NomeIcone = keyof typeof icones;

interface IconeProps extends ComponentProps<"svg"> {
  nome: NomeIcone;
  tamanho?: number;
  className?: string;
}

export function Icone({
  nome,
  tamanho = 24,
  className = "",
  ...props
}: IconeProps) {
  const ComponenteSvg = icones[nome];

  if (!ComponenteSvg) {
    return null;
  }

  return (
    <ComponenteSvg
      width={tamanho}
      height={tamanho}
      className={`shrink-0 fill-current ${className}`}
      {...props}
    />
  );
}
