"use client";

import { BotaoIcone } from "@/components/ui/BotaoIcone";

interface BarraLateralProps {
  corDeFundo?: string;
  corDaBorda?: string;
}

export function BarraLateral({
  corDeFundo = "#C8911A",
  corDaBorda = "#000000",
}: BarraLateralProps) {
  return (
    <aside
      className="w-16 h-screen flex flex-col justify-between items-center py-4 border-r"
      style={{
        backgroundColor: corDeFundo,
        borderColor: corDaBorda,
      }}
    >
      <div className="flex flex-col gap-3">
        <BotaoIcone nomeIcone="leaderboard" onClick={() => ""} />
        <BotaoIcone nomeIcone="usuario" onClick={() => ""} />
      </div>

      <BotaoIcone nomeIcone="configuracoes" onClick={() => ""} />
    </aside>
  );
}
