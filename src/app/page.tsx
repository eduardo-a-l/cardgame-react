import { BarraLateral } from "@/components/layout/BarraLateral";
import { Botao } from "@/components/ui/Botao";

export default function PaginaPrincipal() {
  return (
    <main className="flex h-screen bg-[#1B1B2F] relative overflow-hidden">
      <div className="z-10">
        <BarraLateral />
      </div>

      <div>
        <Botao
          texto="Jogar"
          nomeIcone="jogar"
          className="-ml-3 rounded-l-none"
        />
        <Botao
          texto="Inventário"
          nomeIcone="inventario"
          className="-ml-3 rounded-l-none"
        />
      </div>

      <div className="absolute bottom-4 right-4">
        <Botao
          texto="Loja"
          nomeIcone="loja"
          corDeFundo="#C8911A"
          corDoTexto="#000000"
          corDaBorda="686868"
        />
      </div>
    </main>
  );
}
