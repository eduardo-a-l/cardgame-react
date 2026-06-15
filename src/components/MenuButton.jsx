function MenuButton({
  text,
  iconSrc,
  backgroundColor = "bg-[#21366B]",
  contentColor = "text-white",
  width = "w-[350px]",
  height = "h-[100px]",
  fontSize = "text-[30px]",
}) {
  return (
    <button
      className={`
        ${backgroundColor} ${contentColor} ${width} ${height} ${fontSize}
        flex items-center justify-center font-bold rounded-[12px]
        border-2 border-[#C8911A] shadow-md
        transition-all duration-150 ease-in-out
        hover:scale-105 hover:brightness-110 active:scale-95 select-none
      `}
    >
      <div className="flex items-center justify-center gap-4 w-full">
        {iconSrc && (
          <img
            src={iconSrc}
            alt=""
            className="w-[52px] h-[52px] object-contain"
          />
        )}
        <span>{text}</span>
      </div>
    </button>
  );
}

export default MenuButton;
