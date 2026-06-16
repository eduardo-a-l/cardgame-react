import React, { useEffect, useRef } from "react";

function ProfilePopover({
  isOpen,
  onClose,
  usuarioLogado,
  onOpenAuth,
  onOpenProfile,
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        if (!event.target.closest(".btn-perfil-lateral")) {
          onClose();
        }
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute left-[110px] top-[140px] z-50 w-72 bg-[#1c1c32] border border-[#C8911A]/60 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-fadeIn text-white font-sans overflow-hidden"
    >
      {!usuarioLogado ? (
        <div className="p-4 space-y-3">
          <div className="text-center text-sm text-gray-400 font-semibold mb-2">
            Você não está conectado
          </div>
          <button
            onClick={() => {
              onOpenAuth(false);
              onClose();
            }}
            className="w-full bg-[#C8911A] hover:brightness-110 text-black font-bold py-2 px-4 rounded-lg transition-all text-sm cursor-pointer"
          >
            Entrar
          </button>
          <button
            onClick={() => {
              onOpenAuth(true);
              onClose();
            }}
            className="w-full bg-transparent hover:bg-white/10 border border-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm cursor-pointer"
          >
            Criar Conta
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="h-24 w-full bg-[#141423] relative overflow-hidden">
            {usuarioLogado.banner ? (
              <img
                src={usuarioLogado.banner}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-r from-[#21366B] to-[#1B1B2F]" />
            )}

            <div className="absolute inset-0 bg-black/40 flex items-center p-3 gap-3">
              <div className="w-14 h-14 rounded-xl border-2 border-[#C8911A]/60 bg-[#21366B] overflow-hidden shrink-0 shadow-md">
                {usuarioLogado.fotoPerfil ? (
                  <img
                    src={usuarioLogado.fotoPerfil}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold uppercase text-white">
                    {usuarioLogado.nomeUsuario.substring(0, 2)}
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-base text-white truncate drop-shadow">
                  {usuarioLogado.nomeUsuario}
                </h4>
                <span className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 uppercase tracking-wide">
                  ● Online
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#141423]/90 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-[#1b1b2f] p-2 rounded-lg border border-white/5">
                <div className="text-gray-400 text-[10px] uppercase">
                  Pontos
                </div>
                <div className="font-mono font-bold text-green-400 text-sm">
                  {usuarioLogado.pontos} P
                </div>
              </div>
              <div className="bg-[#1b1b2f] p-2 rounded-lg border border-white/5">
                <div className="text-gray-400 text-[10px] uppercase">
                  Moedas
                </div>
                <div className="font-mono font-bold text-[#C8911A] text-sm">
                  {usuarioLogado.moedas}G
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onOpenProfile();
                onClose();
              }}
              className="w-full bg-[#21366B] hover:bg-[#2c4991] text-white border border-[#C8911A]/40 font-bold py-1.5 rounded-lg transition-all text-xs cursor-pointer text-center"
            >
              Ver perfil público
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePopover;
