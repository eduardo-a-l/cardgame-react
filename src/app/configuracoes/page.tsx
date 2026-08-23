import { Botao } from "@/components/ui/Botao";

export default function TelaConfiguracoes() {
  return (
    <main className="p-10 h-screen bg-[#1B1B2F]">
      <div>
        <h1 className="text-white">Configurações</h1>
      </div>
      <div className="vgap-10">
        <Botao texto="Deletar Conta" />
        <Botao texto="Sair da Conta" />
      </div>
    </main>
  );
}
