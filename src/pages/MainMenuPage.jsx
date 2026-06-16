import LogoImg from "../assets/Logo.svg";
import PlayImg from "../assets/Play.svg";
import PackageImg from "../assets/Package.svg";
import BaralhosImg from "../assets/BaralhosIcone.svg";
import ArrowLeftCircleImg from "../assets/Arrow left-circle.svg";
import IconRankingImg from "../assets/IconRanking.svg";
import UserImg from "../assets/User.svg";
import SettingsImg from "../assets/Settings.svg";
import ShoppingCartImg from "../assets/Shopping cart.svg";
import BackgroundGif from "../assets/Background.gif";
import MenuButton from "../components/MenuButton";

import AuthModal from "../components/modals/AuthModal.jsx";
import ProfileModal from "../components/modals/ProfileModal.jsx";
import RankingModal from "../components/modals/RankingModal.jsx";
import { useMenuViewModel } from "../viewmodels/MenuViewModel.jsx";

function MainMenuPage() {
  const vm = useMenuViewModel();

  return (
    <div
      className="relative w-screen h-screen bg-[#1B1B2F] overflow-hidden flex font-sans text-white select-none"
      onMouseMove={(e) => {
        if (e.clientX <= 150) {
          vm.setIsHovered(true);
        } else {
          vm.setIsHovered(false);
        }
      }}
    >
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center md:hidden">
        <span className="text-red-500 font-bold text-xl mb-2 uppercase tracking-widest">
          Resolução não suportada
        </span>
        <p className="text-gray-400 text-sm max-w-xs">
          A tela do seu dispositivo é muito pequena. Por favor utilize uma tela
          maior.
        </p>
      </div>

      <div
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `url(${BackgroundGif})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {vm.usuarioLogado && (
        <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-1 bg-[#141423]/80 backdrop-blur border border-[#C8911A]/40 px-4 py-2 rounded-xl shadow-lg">
          <span className="text-[#C8911A] font-extrabold text-[15px] font-mono tracking-wide">
            {vm.usuarioLogado.moedas}G
          </span>
          <span className="text-green-400 font-bold text-[12px] font-mono">
            {vm.usuarioLogado.pontos} P
          </span>
        </div>
      )}

      <div
        className={`h-full flex flex-col justify-center gap-16 z-10 transition-all duration-300 ease-out
          ${vm.isHovered ? "pl-[95px]" : "pl-[5px]"}`}
      >
        <MenuButton text="Jogar" iconSrc={PlayImg} />
        <MenuButton text="Inventário" iconSrc={PackageImg} />
        <MenuButton text="Baralhos" iconSrc={BaralhosImg} />
        <MenuButton text="Sair" iconSrc={ArrowLeftCircleImg} />
      </div>

      <div
        className={`absolute left-0 top-0 h-full w-[100px] bg-[#C8911A] flex flex-col justify-between items-center py-6 z-20 shadow-xl transition-all duration-300 ease-out
          ${vm.isHovered ? "translate-x-0 pl-0" : "-translate-x-[88px] pl-[88px]"}`}
      >
        <div className="flex flex-col items-center gap-8 w-full transition-opacity duration-200">
          <button
            onClick={() => vm.setIsRankingModalOpen(true)}
            className={`cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90 ${vm.isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={IconRankingImg}
              alt="Ranking"
              className="w-[35px] h-[35px] brightness-0"
            />
          </button>

          <button
            onClick={() => {
              if (vm.usuarioLogado) {
                vm.setPerfilVisualizado(vm.usuarioLogado);
                vm.setIsProfileModalOpen(true);
              } else {
                vm.setIsAuthModalOpen(true);
              }
            }}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 flex flex-col items-center gap-1 w-full px-2 ${vm.isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            {vm.usuarioLogado && vm.usuarioLogado.fotoPerfil ? (
              <img
                src={vm.usuarioLogado.fotoPerfil}
                alt="Perfil"
                className="w-[45px] h-[45px] rounded-full object-cover border-2 border-[#1B1B2F]"
              />
            ) : (
              <img
                src={UserImg}
                alt="Perfil"
                className="w-[35px] h-[35px] brightness-0"
              />
            )}
            {vm.usuarioLogado && (
              <span className="text-[11px] font-bold text-[#1B1B2F] truncate max-w-full block">
                {vm.usuarioLogado.nomeUsuario}
              </span>
            )}
          </button>
        </div>

        <button
          className={`cursor-pointer transition-all duration-300 hover:rotate-90 active:scale-90 ${vm.isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img
            src={SettingsImg}
            alt="Configurações"
            className="w-[35px] h-[35px] brightness-0"
          />
        </button>
      </div>

      <div className="absolute right-[25%] top-1/2 -translate-y-1/2 select-none pointer-events-none z-10">
        <img
          src={LogoImg}
          alt="Logo"
          className="w-[480px] h-[480px] object-contain"
        />
        {vm.usuarioLogado && (
          <div className="text-center font-bold text-[#C8911A] text-[20px] tracking-wide mt-2">
            Bem-vindo, {vm.usuarioLogado.nomeUsuario}!
          </div>
        )}
      </div>

      <div className="absolute bottom-8 -right-2 z-10">
        <MenuButton
          text="Loja"
          iconSrc={ShoppingCartImg}
          backgroundColor="bg-[#C8911A]"
          contentColor="text-black"
          width="w-[200px]"
        />
      </div>

      <div
        className={`absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-[#21366B]/95 border-2 border-[#C8911A] p-2 rounded-xl transition-all duration-300 shadow-lg
          ${vm.isHovered ? "translate-x-[95px]" : "translate-x-0"}`}
      >
        <span
          className={`w-3 h-3 rounded-full ${vm.isServerConnected ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"}`}
        />
        <label className="text-[12px] font-bold text-[#C8911A] uppercase tracking-wider">
          API IP:
        </label>
        <input
          type="text"
          value={vm.serverIp}
          onChange={(e) => vm.setServerIpState(e.target.value)}
          placeholder="Ex: 192.168.1.50:5262"
          className="bg-[#1B1B2F] text-white font-mono text-[14px] px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-[#C8911A] w-[180px]"
        />
        <button
          onClick={() => vm.testConnection(false)}
          className="bg-[#C8911A] text-black font-bold text-[12px] px-3 py-1 rounded-md cursor-pointer hover:brightness-110 active:scale-95 transition-all"
        >
          Testar
        </button>
      </div>

      <AuthModal
        isOpen={vm.isAuthModalOpen}
        onClose={() => vm.setIsAuthModalOpen(false)}
        isServerConnected={vm.isServerConnected}
        isRegisterMode={vm.isRegisterMode}
        setIsRegisterMode={vm.setIsRegisterMode}
        usernameInput={vm.usernameInput}
        setUsernameInput={vm.setUsernameInput}
        passwordInput={vm.passwordInput}
        setPasswordInput={vm.setPasswordInput}
        authMessage={vm.authMessage}
        setAuthMessage={vm.setAuthMessage}
        onSubmit={vm.handleAuthSubmit}
      />

      <RankingModal
        isOpen={vm.isRankingModalOpen}
        onClose={() => vm.setIsRankingModalOpen(false)}
        isServerConnected={vm.isServerConnected}
        rankingList={vm.rankingList}
        onSelectPlayer={(player) => {
          vm.setPerfilVisualizado(player);
          vm.setIsProfileModalOpen(true);
        }}
      />

      <ProfileModal
        isOpen={vm.isProfileModalOpen}
        onClose={() => vm.setIsProfileModalOpen(false)}
        usuario={vm.perfilVisualizado}
        usuarioLogado={vm.usuarioLogado}
        avatarUrl={vm.avatarUrl}
        setAvatarUrl={vm.setAvatarUrl}
        bannerUrl={vm.bannerUrl}
        setBannerUrl={vm.setBannerUrl}
        rankingList={vm.rankingList}
        onSaveCustomization={vm.handleSaveCustomization}
        onLogout={vm.handleLogout}
      />
    </div>
  );
}

export default MainMenuPage;
