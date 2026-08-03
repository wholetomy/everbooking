"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Usuario = {
    cod_usuario: number;
    nome: string;
    email: string;
    cod_tipo_usuario: number;
    tipo_usuario: string;
    status: string;
    created_at: string;
};

type AuthContextType = {
    usuario: Usuario | null;
    carregando: boolean;
    AtualizarUsuario: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: {children: ReactNode}) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);
    
    useEffect(() => {
        AtualizarUsuario();
    }, []);

    async function AtualizarUsuario() {
        try {
            const response = await fetch(`${API_URL}/users/me`, {
                credentials: "include",
            });

            if (!response.ok) {
                setUsuario(null);
                return;
            }

            const data = await response.json();

            setUsuario(data);
        } catch {
            setUsuario(null);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                carregando,
                AtualizarUsuario
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }

    return context;
}