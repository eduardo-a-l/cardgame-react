import { useState } from "react";
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

function MainMenuPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-screen h-screen bg-[#1B1B2F] overflow-hidden flex font-sans"
      onMouseMove={(e) => {
        if (e.clientX <= 150) {
          setIsHovered(true);
        } else {
          setIsHovered(false);
        }
      }}
    >
      <div
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `url(${BackgroundGif})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        className={`h-full flex flex-col justify-center gap-16 z-10 transition-all duration-300 ease-out
          ${isHovered ? "pl-[75px]" : "pl-[5px]"}`}
      >
        <MenuButton text="Jogar" iconSrc={PlayImg} />
        <MenuButton text="Inventário" iconSrc={PackageImg} />
        <MenuButton text="Baralhos" iconSrc={BaralhosImg} />
        <MenuButton text="Sair" iconSrc={ArrowLeftCircleImg} />
      </div>

      <div
        className={`absolute left-0 top-0 h-full w-[80px] bg-[#C8911A] flex flex-col justify-between items-center py-6 z-20 shadow-xl transition-all duration-300 ease-out
          ${isHovered ? "translate-x-0 pl-0" : "-translate-x-[68px] pl-[68px]"}`}
      >
        <div className="flex flex-col items-center gap-8 w-full transition-opacity duration-200">
          <button
            className={`cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90 [filter:brightness(0)] ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={IconRankingImg}
              alt="Ranking"
              className="w-[35px] h-[35px]"
            />
          </button>

          <button
            className={`cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90 [filter:brightness(0)] ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img src={UserImg} alt="Perfil" className="w-[35px] h-[35px]" />
          </button>
        </div>

        <button
          className={`cursor-pointer transition-all duration-300 hover:rotate-90 active:scale-90 [filter:brightness(0)] ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img
            src={SettingsImg}
            alt="Configurações"
            className="w-[35px] h-[35px]"
          />
        </button>
      </div>

      <div className="absolute right-[25%] top-1/2 -translate-y-1/2 select-none pointer-events-none z-10">
        <img
          src={LogoImg}
          alt="Logo"
          className="w-[480px] h-[480px] object-contain"
        />
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
    </div>
  );
}

export default MainMenuPage;
