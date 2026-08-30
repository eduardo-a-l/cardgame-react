"use client";

import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";

export default function TelaConfiguracoes() {
  const router = useRouter();

  return (
    <main className="relative h-screen bg-[#1B1B2F] overflow-hidden">
      <div className="absolute m-10">
        <Botao
          texto="Voltar"
          nomeIcone="voltar"
          tamanhoIcone={40}
          corDoTexto="#FFFFFF"
          corDeFundo="transparent"
          corDaBorda="transparent"
          className="px-0 py-0 text-3xl"
          onClick={() => router.push("/")}
        />
      </div>

      <h1 className="pt-20 text-center text-4xl text-white">Configurações</h1>

      <div className="absolute left-15 bottom-15 flex flex-col gap-6">
        <Botao
          texto="Deletar Conta"
          corDoTexto="#FFFFFF"
          className="px-20 py-6 text-3xl"
          onClick={() => {}}
        />

        <Botao
          texto="Sair da Conta"
          corDoTexto="#FFFFFF"
          className="px-20 py-6 text-3xl"
          onClick={() => {}}
        />
      </div>
    </main>
  );
}
