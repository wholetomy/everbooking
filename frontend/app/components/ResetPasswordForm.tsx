"use client";

import { useState, Dispatch, SetStateAction } from "react";
import DarkModeButton from "./DarkModeButton";

type ResetPasswordFormProps = {
  TrocarDeTela: (novaTela: "login" | "reset" | "cadastro") => void;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
  isDarkMode: boolean;
};

type PerguntaSecreta = {
  cod_pergunta_secreta: number;
  pergunta_secreta: string;
};

type Fases = "fase 1" | "fase 2";

export default function ResetPasswordForm({ TrocarDeTela, setIsDarkMode, isDarkMode }: ResetPasswordFormProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [fase, setFase] = useState<Fases>("fase 1");
  const [email, setEmail] = useState<string>("");
  const [perguntaSecreta, setPerguntaSecreta] = useState<PerguntaSecreta>();
  const [novaSenha, setNovaSenha] = useState<string>("");
  const [respostaSecreta, setRespostaSecreta] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);

  const TrazerPerguntaSecreta = async () => {
    if (!email) {
      setErro("Informe o e-mail.");
      return;
    }

    setErro(null);

    try {
      const response = await fetch(`${API_URL}/auth/esqueci-senha`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          email
        })
      });

      if (!response.ok) {
        const erro = await response.json();
        if (erro.detail?.[0]?.loc?.includes("email")) {
          setErro("Informe um e-mail válido.");
          return;
        }
        throw new Error(erro.detail);
      }

      const result = await response.json();

      setPerguntaSecreta(result);

      setFase("fase 2");

    } catch (e) {
      if (e instanceof Error) {
        setErro(e.message);
      } else {
        setErro("Ocorreu um erro inesperado.");
      }

      console.error(e);
    }
  };

  const RedefinirSenha = async () => {
    if (!email || !novaSenha || !respostaSecreta) {
      setErro("Todos os campos precisam ser preenchidos.");
      return;
    }

    setErro(null);

    try {
      const response = await fetch(`${API_URL}/auth/reset`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          resposta_secreta: respostaSecreta,
          nova_senha: novaSenha
        })
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.detail);
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
      <div className="flex flex-col gap-4 p-4 w-68.75 min-h-92 dark:text-white bg-[#FFFFFF] dark:bg-[#292B38] transition-colors duration-200 ease-in-out shadow-lg rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">Reset</span>
          <DarkModeButton isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>
        {erro && (
          <div className="rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300">
            {erro}
          </div>
        )}
        {fase === "fase 1" ? (
          <>
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
            <div>
              <button
                className="flex flex-col w-full border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] font-medium rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out"
                onClick={TrazerPerguntaSecreta}
              >
                Avançar
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <span className="font-medium">
                Pergunta secreta
              </span>
              <input
                className="outline-none border cursor-not-allowed border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                type="text"
                value={perguntaSecreta?.pergunta_secreta}
                readOnly />
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
            <div className="flex flex-col">
              <span className="font-medium">
                Nova senha
              </span>
              <input
                className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)} />
            </div>
            <div>
              <button
                className="flex flex-col w-full border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] font-medium rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out"
                onClick={RedefinirSenha}
              >
                Redefinir
              </button>
            </div>
          </>
        )}
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
