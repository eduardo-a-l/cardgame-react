'use client';
import React, { use, useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";
import { BotaoIcone } from "@/components/ui/BotaoIcone";
export default function Selecioar_oponente()
{

    const [ListaOponentes, setListaOponentes] = useState(
  Array.from({ length: 10 }, (_, index) => `Oponente ${index + 1}`)
);
    const   [Aberto, setAberto] = useState(false)
    const [ usuario, setUsuario] = useState("")
    const [pin, setPin] = useState("")

    return (
        <div className= "bg-blue-950 flex flex-col min-h-screen max-w-3xl  min-w-screen relative">
            <BotaoIcone nomeIcone="voltar" tamanhoIcone={45}  className="text-white  text-5xl ml-8 mt-8 gap-1 absolute left-0 ">Voltar</BotaoIcone>

            <div className="flex  justify-center">

                <p className="text-5xl mt-24">Selecionar oponente</p>

                </div> 
                
                <div className="flex flex-col">
                    <div className="flex justify-around text-3xl mt-40">
                        <p>Usuário</p>
                        <p>PIN de Batalha {}</p>
                    </div>
                    <div className="flex justify-between pr-79 pl-79">
                        <div className="relative">
                        <input type="text" readOnly value={usuario || "Escolher Oponente"} className= {`  border border-gray-500 w-100 pl-2  h-10 ${!(usuario != "")? "text-gray-400" : ""}` } />
                        <button className="absolute right-0 pr-2.5 pt-2 cursor-pointer hover:scale-105 transition-all" onClick={() => setAberto(!Aberto)}>{Aberto ? "▼" : "▲"}</button>
                        { Aberto &&(
                        <ul className= "absolute right-0 bg-blue-700  rounded-md w-30 transition-all shadow-black shadow-2xl">
                            {ListaOponentes?.map((User, index) => 
                                    (
                                        <li key={index} className="pl-3.5 pb-1 cursor-pointer rounded-md hover:scale-105 transition-all hover:bg-blue-800 border-b border-b-blue-950" onClick={() =>{setAberto(false); setUsuario(User); }}>{User}</li>
                                    ))}
                        </ul>)
                        }


                        
                        </div>
                        <input placeholder="Digite o PIN" type="text" className="bg-blue-800 border border-white rounded-md pl-2 h-10 w-100"></input>
                        


                    </div>

                        <div className="flex justify-center">
                            <Botao texto="Continuar" className="w-50 cursor-pointer  h-14 text-3xl place-content-center bg-blue-900 rounded-md border-3 border-amber-400 mt-60 hover:scale-105 transition-all"></Botao>
                        </div>

                </div>
        </div>
    );



}