import IconeLeaderboard from "@/assets/icons/leaderboard.svg";
import IconeUsuario from "@/assets/icons/user.svg";
import IconeConfiguracoes from "@/assets/icons/settings.svg";
import { ComponentProps } from "react";

const icones = {
  leaderboard: IconeLeaderboard,
  usuario: IconeUsuario,
  configuracoes: IconeConfiguracoes,
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
