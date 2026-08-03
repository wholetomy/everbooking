"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from 'next/navigation';
import DarkModeButton from "./DarkModeButton";
import { useAuth } from "../contexts/AuthContext";

type LoginFormProps = {
    TrocarDeTela: (novaTela: "login" | "reset" | "cadastro") => void;
    setIsDarkMode: Dispatch<SetStateAction<boolean>>;
    isDarkMode: boolean;
};

export default function LoginForm({ TrocarDeTela, setIsDarkMode, isDarkMode }: LoginFormProps) {
    const router = useRouter();
    const { AtualizarUsuario } = useAuth();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [erro, setErro] = useState<string | null>(null);

    const Logar = async () => {
        if (!email || !senha) {
            setErro("Todos os campos precisam ser preenchidos.");
            return;
        }

        setErro(null);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    senha
                })
            });

            if (!response.ok) {
                const erro = await response.json();

                if (Array.isArray(erro.detail)) {
                    if (erro.detail.some((e: any) => e.loc.includes("email"))) {
                        setErro("Informe um e-mail válido.");
                        return;
                    }
                }

                if (typeof erro.detail === "string") {
                    setErro(erro.detail);
                    return;
                }

                setErro("Erro ao realizar login.");
                return;
            }

            if (response.ok) {
                await AtualizarUsuario();
                router.push("/home");
            }

        } catch (e) {
            if (e instanceof Error) {
                setErro(e.message);
            } else {
                setErro("Ocorreu um erro inesperado.");
            }

            console.error(e);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-4 p-4 min-h-92 w-68.75 dark:text-white bg-[#FFFFFF] dark:bg-[#292B38] transition-colors duration-200 ease-in-out shadow-lg rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">Login</span>
                    <DarkModeButton isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                </div>
                {erro && (
                    <div className="rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300">
                        {erro}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-medium">
                        E-mail
                    </span>
                    <input
                        className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">
                        Senha
                    </span>
                    <input
                        className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)} />
                </div>
                <div>
                    <button
                        className="flex flex-col w-full border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] font-medium rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out"
                        onClick={Logar}
                    >
                        Login
                    </button>
                </div>
                <div className="flex justify-center">
                    <span
                        className="underline cursor-pointer hover:text-[#B19252] hover:dark:text-[#656395] transition-colors duration-200 ease-in-out"
                        onClick={() => TrocarDeTela("reset")}
                    >
                        Esqueci minha senha
                    </span>
                </div>
            </div>
            <span
                className="underline cursor-pointer hover:text-[#B19252] hover:dark:text-[#656395] dark:text-[#DFDFEB] transition-colors duration-200 ease-in-out"
                onClick={() => TrocarDeTela("cadastro")}
            >
                Cadastre-se
            </span>
        </>
    )
}
