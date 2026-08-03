"use client";

import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Sala = {
    cod_sala: number;
    sala: string;
    descricao: string;
    localizacao: string;
    capacidade: string;
    imagem: string;
    status: string;
    created_at: string;
};

type Agendamentos = {
    cod_agendamento: number;
    agendado_por: number;
    nome_agendado_por: string;
    cod_sala: number;
    sala: string;
    horario_inicial: string;
    horario_final: string;
    status_agendamento: string;
    created_at: string;
};

export default function Sala() {
    const params = useParams();
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const codSala = params.cod_sala as string;
    const [sala, setSala] = useState<Sala>();
    const [modalOpened, setModalOpened] = useState<boolean>(false);
    const [horarioInicial, setHorarioInicial] = useState<string>("");
    const [horarioFinal, setHorarioFinal] = useState<string>("");
    const [erro, setErro] = useState<string | null>(null);
    const [agendamentos, setAgendamentos] = useState<Agendamentos[]>([]);

    useEffect(() => {
        if (!codSala) return;

        const codigo = Number(codSala);

        if (isNaN(codigo) || codigo <= 0) {
            router.replace("/home");
            return;
        }

        TrazerInformacoesDaSala();
    }, [codSala, router]);

    const TrazerInformacoesDaSala = async () => {
        try {
            const response = await fetch(`${API_URL}/salas/${codSala}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                router.replace("/home");
                return;
            }

            const result = await response.json();

            setSala(result);
        } catch (error) {
            console.error(error);
            router.replace("/home");
        }
    };

    const ValidarAgendamento = async () => {
        if (!horarioInicial || !horarioFinal) {
            setErro("Todos os campos precisam ser preenchidos.");
            return;
        }

        if (horarioInicial >= horarioFinal) {
            setErro("O horário inicial deve ser menor que o horário final.");
            return;
        }

        setErro(null);

        try {
            const response = await fetch(
                `${API_URL}/salas/${codSala}/disponibilidade?horario_inicial=${encodeURIComponent(horarioInicial)}&horario_final=${encodeURIComponent(horarioFinal)}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const erro = await response.json();

                if (typeof erro.detail === "string") {
                    setErro(erro.detail);
                    return;
                }

                setErro("Não foi possível validar a disponibilidade da sala.");
                return;
            }

            const result = await response.json();

            if (result.disponivel) {
                setErro(null);
                AgendarSala();
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

    const AgendarSala = async () => {
        try {
            const response = await fetch(`${API_URL}/agendamentos/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    cod_sala: Number(codSala),
                    horario_inicial: horarioInicial,
                    horario_final: horarioFinal
                })
            });

            if (!response.ok) {
                const erro = await response.json();

                if (typeof erro.detail === "string") {
                    setErro(erro.detail);
                    return;
                }

                setErro("Não foi possível agendar a sala.");
                return;
            }

            const result = await response.json();

            await BuscarAgendamentos();
            setHorarioInicial("");
            setHorarioFinal("");
            setErro(null);
            console.log(result.message);

        } catch (error) {
            console.error(error);
            router.replace("/home");
        }
    };

    const BuscarAgendamentos = async () => {
        try {
            const response = await fetch(`${API_URL}/agendamentos/${codSala}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.detail);
            }

            const result = await response.json();

            setAgendamentos(result);

        } catch (error) {
            console.error(error);
            router.replace("/home");
        }
    };

    if (!sala) {
        return null;
    }

    return (
        <>
            <div className="flex flex-col h-screen bg-[#FCF9F2] dark:bg-[#191A2C] text-white transition-colors duration-200 ease-in-out">
                <Navbar />
                <div className="flex-1 min-h-0 p-8 md:grid md:grid-cols-2 flex flex-col gap-4">
                    <div className="h-full overflow-hidden rounded-lg shadow-lg">
                        <img
                            src={sala.imagem}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="h-full flex flex-col justify-between gap-2 p-4 bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] shadow-lg rounded-lg">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap justify-between items-center gap-2">
                                <h1
                                    className="text-2xl font-bold text-black dark:text-white"
                                >
                                    {sala.sala}
                                </h1>
                                <span
                                    className="bg-[#F4E9D7] text-[#5D4E39] dark:bg-[#373644] dark:text-[#C4C6DB] rounded-lg px-3"
                                >
                                    Capacidade: {sala.capacidade} {Number(sala.capacidade) === 1 ? "pessoa" : "pessoas"}
                                </span>
                            </div>
                            <div>
                                <span>Localização: {sala.localizacao}</span>
                            </div>
                            <div>
                                <span>{sala.descricao}</span>
                            </div>
                        </div>
                        <div className="w-full flex justify-end">
                            <button
                                className="flex flex-col border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] rounded-lg px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out"
                                onClick={() => {
                                    setModalOpened(true);
                                    BuscarAgendamentos();
                                }}
                            >
                                Agendar
                            </button>
                        </div>
                    </div>
                </div>
                {modalOpened && (
                    <>
                        <div className="fixed bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full min-h-screen z-10" />
                        <div className="bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] overflow-y-auto flex flex-col fixed top-1/2 left-1/2 w-[90%] h-[85%] p-8 z-20 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg transiton-colors duration-200 ease-in-out">
                            <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
                                <h1 className="text-2xl font-semibold tex-black dark:text-white ">Agendamento</h1>
                                <button
                                    className="bg-[#f44336] hover:bg-[#ff4336cc] text-white rounded-lg px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out"
                                    onClick={() => setModalOpened(false)}
                                >
                                    Fechar
                                </button>
                            </div>
                            <div className="flex-1 md:grid md:grid-cols-[200px_1fr] flex flex-col gap-2">
                                <div className="md:w-50 w-full dark:text-white border border-[#B19252] dark:border-[#656395] p-2 flex flex-col gap-2 rounded">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">Horário inicial</span>
                                        <input
                                            className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                                            type="datetime-local"
                                            value={horarioInicial}
                                            onChange={(e) => setHorarioInicial(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">Horário final</span>
                                        <input
                                            className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                                            type="datetime-local"
                                            value={horarioFinal}
                                            onChange={(e) => setHorarioFinal(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <button
                                            className="flex flex-col w-full border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] font-medium rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out"
                                            onClick={() => ValidarAgendamento()}
                                        >
                                            Agendar
                                        </button>
                                    </div>
                                    {erro && (
                                        <div className="rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300">
                                            {erro}
                                        </div>
                                    )}
                                </div>
                                <div className="border border-[#B19252] dark:border-[#656395] rounded p-2 overflow-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#B19252] dark:border-[#656395] text-left">
                                                <th className="p-3 font-semibold">Agendado por</th>
                                                <th className="p-3 font-semibold">Início</th>
                                                <th className="p-3 font-semibold">Fim</th>
                                                <th className="p-3 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {agendamentos.length > 0 ? (
                                                agendamentos.map((agendamento) => (
                                                    <tr
                                                        key={agendamento.cod_agendamento}
                                                        className="border-b border-[#e8d6b5] dark:border-[#4a4964] hover:bg-[#F9F3E8] dark:hover:bg-[#34354A] transition-colors"
                                                    >
                                                        <td className="p-3 font-medium whitespace-nowrap">
                                                            {agendamento.nome_agendado_por}
                                                        </td>

                                                        <td className="p-3 whitespace-nowrap">
                                                            {new Date(agendamento.horario_inicial).toLocaleString(
                                                                "pt-BR",
                                                                {
                                                                    dateStyle: "short",
                                                                    timeStyle: "short",
                                                                }
                                                            )}
                                                        </td>

                                                        <td className="p-3 whitespace-nowrap">
                                                            {new Date(agendamento.horario_final).toLocaleString(
                                                                "pt-BR",
                                                                {
                                                                    dateStyle: "short",
                                                                    timeStyle: "short",
                                                                }
                                                            )}
                                                        </td>

                                                        <td className="p-3">
                                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${agendamento.status_agendamento === "Agendado"
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                                }`}>
                                                                {agendamento.status_agendamento}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        className="p-6 text-center text-[#6b6b6b] dark:text-[#9d9db1]"
                                                    >
                                                        Nenhum agendamento encontrado.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}