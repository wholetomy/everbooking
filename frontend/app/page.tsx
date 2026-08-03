"use client";

import { useState, useLayoutEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { useTheme } from "./contexts/ThemeContext";

type Telas = "login" | "reset" | "cadastro";

export default function Login() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [tela, setTela] = useState<Telas>("login");

  useLayoutEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const TrocarDeTela = (novaTela: Telas) => {
    setTela(novaTela);
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen p-8 bg-[#FCF9F2] dark:bg-[#191A2C] transition-colors duration-200 ease-in-out">
        {tela === "login" && <LoginForm TrocarDeTela={TrocarDeTela} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
        {tela === "reset" && <ResetPasswordForm TrocarDeTela={TrocarDeTela} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
        {tela === "cadastro" && <RegisterForm TrocarDeTela={TrocarDeTela} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
      </div>
    </>
  )
}

