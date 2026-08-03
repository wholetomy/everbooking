"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import AdminUsuarios from "../components/AdminUsuarios";
import AdminSalas from "../components/AdminSalas";
import AdminLocalizacao from "../components/AdminLocalizacao";
import AdminAgendamentos from "../components/AdminAgendamentos";

export default function Gerenciador() {
    const [abaAtiva, setAbaAtiva] = useState<number>(0);

    const abas = [
        {
            id: 0,
            nomeDaAba: "Usuários",
            tela: <AdminUsuarios />
        },
        {
            id: 1,
            nomeDaAba: "Salas",
            tela: <AdminSalas />
        },
        {
            id: 2,
            nomeDaAba: "Localizações",
            tela: <AdminLocalizacao />
        },
        {
            id: 3,
            nomeDaAba: "Agendamentos",
            tela: <AdminAgendamentos />
        }
    ];

    return (
        <>
            <div className="flex flex-col min-h-screen bg-[#FCF9F2] dark:bg-[#191A2C] text-white transition-colors duration-200 ease-in-out">
                <Navbar />
                <div className="flex-1 min-h-0 p-8 flex flex-col gap-2 md:gap-0">

                    <div className="hidden md:flex flex-wrap text-wrap gap-2">
                        {abas.map(aba => (
                            <button
                                className={`${abaAtiva === aba.id ? "-mb-0.5 z-10 border border-b-[#FEFDFB] dark:border-b-[#2A2939] dark:border-[#656395] border-[#B19252] bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1]" : "border-transparent"} text-black dark:text-white p-2 cursor-pointer transition-colors duration-200 ease-in-out`}
                                key={aba.id}
                                onClick={() => setAbaAtiva(aba.id)}
                            >
                                {aba.nomeDaAba}
                            </button>
                        ))}
                    </div>
                    <select
                        className="block md:hidden outline-none border bg-[#FEFDFB] text-black dark:bg-[#2A2939] dark:text-white border-[#B19252] dark:border-[#656395] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                        value={abaAtiva}
                        onChange={(e) => setAbaAtiva(Number(e.target.value))}
                    >
                        {abas.map((aba) => (
                            <option key={aba.id} value={aba.id}>
                                {aba.nomeDaAba}
                            </option>
                        ))}
                    </select>
                    <div className="flex-1 p-4 border dark:border-[#656395] border-[#B19252] bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] shadow-lg">
                        {abas[abaAtiva].tela}
                    </div>
                </div>
            </div>
        </>
    )
}
