"use client";

import Image from "next/image";
import { ComponentProps } from "react";

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
} as const;

export type NomeIcone = keyof typeof icones;

interface IconeProps extends Omit<
  ComponentProps<"img">,
  "src" | "alt" | "width" | "height"
> {
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
  const fonteSvg = icones[nome];

  if (!fonteSvg) {
    return null;
  }

  return (
    <Image
      src={fonteSvg}
      alt={nome}
      width={tamanho}
      height={tamanho}
      className={`shrink-0 ${className}`}
      {...props}
    />
  );
}
