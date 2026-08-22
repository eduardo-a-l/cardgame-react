interface BotaoProps {
  texto: string;
  onClick?: () => void;
  corDeFundo?: string;
  corDaBorda?: string;
  corDoTexto?: string;
}

export function Botao({
  texto,
  onClick,
  corDeFundo = "#21366B",
  corDaBorda = "#C8911A",
  corDoTexto = "#FFFFFF",
}: BotaoProps) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: corDeFundo,
        color: corDoTexto,
        borderColor: corDaBorda,
        borderRadius: "5px",
      }}
    >
      {texto}
    </button>
  );
}
