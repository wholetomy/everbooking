"use client";

import { useState, Dispatch, SetStateAction, useEffect } from "react";
import DarkModeButton from "./DarkModeButton";

type RegisterFormProps = {
    TrocarDeTela: (novaTela: "login" | "reset" | "cadastro") => void;
    setIsDarkMode: Dispatch<SetStateAction<boolean>>;
    isDarkMode: boolean;
};

type PerguntasSecretas = {
    cod_pergunta_secreta: number;
    pergunta_secreta: string;
};

export default function RegisterForm({ TrocarDeTela, setIsDarkMode, isDarkMode }: RegisterFormProps) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [nome, setNome] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [perguntaSecreta, setPerguntaSecreta] = useState<number>();
    const [respostaSecreta, setRespostaSecreta] = useState<string>("");
    const [perguntasSecretas, setPerguntasSecretas] = useState<PerguntasSecretas[]>([]);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        TrazerPerguntasSecretas();
    }, [])

    const TrazerPerguntasSecretas = async () => {
        setErro(null);

        try {
            const response = await fetch(`${API_URL}/auth/perguntas-secretas`, {
                credentials: "include",
            });

            if (!response.ok) {
                const erro = await response.json();
                if (erro.detail?.[0]?.loc?.includes("email")) {
                    setErro("Informe um e-mail válido.");
                    return;
                }
                throw new Error(erro.detail);
            }

            const result = await response.json()

            setPerguntasSecretas(result);

            if (result.length > 0) {
                setPerguntaSecreta(result[0].cod_pergunta_secreta);
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

    const Cadastrar = async () => {
        if (!nome || !email || !senha || !respostaSecreta) {
            setErro("Todos os campos precisam ser preenchidos.");
            return;
        }

        setErro(null);

        try {
            const response = await fetch(`${API_URL}/users/cadastro`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    cod_pergunta_secreta: perguntaSecreta,
                    resposta_secreta: respostaSecreta
                })
            });

            if (!response.ok) {
                const erro = await response.json();

                if (erro.detail?.[0]?.loc?.includes("email")) {
                    setErro("Informe um e-mail válido.");
                    return;
                }

                setErro("Erro ao cadastrar.");
                return;
            }

            TrocarDeTela("login");

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
            <div className="flex flex-col gap-4 p-4 w-68.75 dark:text-white bg-[#FFFFFF] dark:bg-[#292B38] transition-colors duration-200 ease-in-out shadow-lg rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">Cadastro</span>
                    <DarkModeButton isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                </div>
                {erro && (
                    <div className="rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300">
                        {erro}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-medium">
                        Nome
                    </span>
                    <input
                        className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">
                        E-mail
                    </span>
                    <input
                        className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">
                        Senha
                    </span>
                    <input
                        className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                        type="text"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">
                        Pergunta secreta
                    </span>
                    <select
                        className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                        value={perguntaSecreta}
                        onChange={(e) => setPerguntaSecreta(Number(e.target.value))}
                    >
                        {perguntasSecretas.map(item =>
                            <option
                                key={item.cod_pergunta_secreta}
                                value={item.cod_pergunta_secreta}
                            >
                                {item.pergunta_secreta}
                            </option>
                        )}
                    </select>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">
                        Resposta
                    </span>
                    <input
                        className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                        type="text"
                        value={respostaSecreta}
                        onChange={(e) => setRespostaSecreta(e.target.value)} />
                </div>
                <div>
                    <button
                        className="flex flex-col w-full border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] font-medium rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out"
                        onClick={Cadastrar}
                    >
                        Cadastrar
                    </button>
                </div>
            </div>
            <span
                className="underline cursor-pointer hover:text-[#B19252] hover:dark:text-[#656395] dark:text-[#DFDFEB] transition-colors duration-200 ease-in-out"
                onClick={() => TrocarDeTela("login")}
            >
                Voltar
            </span>
        </>
    )
}
