"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import DarkModeButton from "./DarkModeButton";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from 'next/navigation';
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { isDarkMode, setIsDarkMode } = useTheme();
    const [isNavbarOpened, setIsNavbarOpened] = useState(false);
    const { usuario } = useAuth();
    const isAdmin = usuario?.cod_tipo_usuario === 2;

    useLayoutEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    useEffect(() => {
        const OcultarNavbarSeATelaForGrande = () => {
            if (window.innerWidth >= 768) {
                setIsNavbarOpened(false);
            }
        };

        window.addEventListener("resize", OcultarNavbarSeATelaForGrande);

        return () => {
            window.removeEventListener("resize", OcultarNavbarSeATelaForGrande);
        };
    }, []);

    return (
        <div className="w-full bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] shadow-lg">
            <div className="flex justify-between items-center py-4 px-8">
                <span
                    className="text-xl font-bold text-black dark:text-white cursor-pointer"
                    onClick={() => { router.push("/home") }}
                >
                    Everbooking
                </span>
                <button
                    className="md:hidden text-2xl cursor-pointer"
                    onClick={() => setIsNavbarOpened(!isNavbarOpened)}
                >
                    {isNavbarOpened ? "✕" : "☰"}
                </button>
                <div className="hidden md:flex gap-4 items-center">
                    <span
                        className="cursor-pointer hover:text-[#B9A371] hover:dark:text-[#7E82E5] transition-colors duration-200 ease-in-out"
                        onClick={() => { router.push('/home') }}
                    >
                        Início
                    </span>
                    <span
                        className="cursor-pointer hover:text-[#B9A371] hover:dark:text-[#7E82E5] transition-colors duration-200 ease-in-out"
                        onClick={() => { router.push('/minhas_reservas') }}
                    >
                        Minhas reservas
                    </span>
                    {isAdmin && (
                        <>
                            <span
                                className="cursor-pointer hover:text-[#B9A371] hover:dark:text-[#7E82E5] transition-colors duration-200 ease-in-out"
                                onClick={() => router.push("/gerenciador")}
                            >
                                Gerenciador
                            </span>

                            <span
                                className="cursor-pointer hover:text-[#B9A371] hover:dark:text-[#7E82E5] transition-colors duration-200 ease-in-out"
                                onClick={() => router.push("/relatorio")}
                            >
                                Relatório
                            </span>
                        </>
                    )}
                    <DarkModeButton isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                </div>
            </div>
            {isNavbarOpened && (
                <div className="md:hidden flex flex-col px-8 pb-4 gap-3 items-center">
                    <span
                        className="cursor-pointer hover:text-[#B9A371] hover:dark:text-[#7E82E5] transition-colors duration-200 ease-in-out"
                        onClick={() => { router.push('/home') }}
                    >
                        Início
                    </span>
                    <span
                        className="cursor-pointer hover:text-[#B9A371] hover:dark:text-[#7E82E5] transition-colors duration-200 ease-in-out"
                        onClick={() => { router.push('/minhas_reservas') }}
                    >
                        Minhas reservas
                    </span>
                    {isAdmin && (
                        <>
                            <span
                                className="cursor-pointer hover:text-[#B9A371] hover:dark:text-[#7E82E5] transition-colors duration-200 ease-in-out"
                                onClick={() => router.push("/gerenciador")}
                            >
                                Gerenciador
                            </span>

                            <span
                                className="cursor-pointer hover:text-[#B9A371] hover:dark:text-[#7E82E5] transition-colors duration-200 ease-in-out"
                                onClick={() => router.push("/relatorio")}
                            >
                                Relatório
                            </span>
                        </>
                    )}
                    <DarkModeButton isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                </div>
            )}
        </div>
    );
}