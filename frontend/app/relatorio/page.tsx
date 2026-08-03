"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import * as XLSX from "xlsx";

type Salas = {
    cod_sala: number;
    sala: string;
};

type StatusDeAgendamento = {
    cod_status_agendamento: number;
    status_agendamento: string;
};

type Relatorio = {
    cod_agendamento: number;
    agendado_por: number;
    nome: string;
    cod_sala: number;
    sala: string;
    horario_inicial: string;
    horario_final: string;
    status_agendamento: string;
    created_at: string;
}

export default function Relatorio() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [salas, setSalas] = useState<Salas[]>([]);
    const [salaSelecionada, setSalaSelecionada] = useState("");
    const [statusAgendamento, setStatusAgendamento] = useState<StatusDeAgendamento[]>([]);
    const [statusAgendamentoSelecionado, setStatusAgendamentoSelecionado] = useState<string>("");
    const [horarioInicialSelecionado, setHorarioInicialSelecionado] = useState("");
    const [horarioFinalSelecionado, setHorarioFinalSelecionado] = useState("");
    const [relatorio, setRelatorio] = useState<Relatorio[]>([]);
    const { carregando } = useAuth();

    useEffect(() => {
        PreencherSalas();
        PreencherStatusDeAgendamento();
        PreencherRelatorio();
    }, []);

    const PreencherSalas = async () => {
        try {

            const response = await fetch(`${API_URL}/salas`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.detail);
            }

            const result = await response.json();

            setSalas(result);

        } catch (e) {
            console.error(e);
        }
    };

    const PreencherStatusDeAgendamento = async () => {
        try {

            const response = await fetch(`${API_URL}/agendamentos/status-de-agendamento`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.detail);
            }

            const result = await response.json();

            setStatusAgendamento(result);

        } catch (e) {
            console.error(e);
        }
    };

    const PreencherRelatorio = async () => {
        try {

            const response = await fetch(`${API_URL}/admin/relatorios`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.detail);
            }

            const result = await response.json();

            setRelatorio(result);

        } catch (e) {
            console.error(e);
        }
    };

    const RelatorioFiltrado = relatorio.filter((item) => {
        if (statusAgendamentoSelecionado !== "" && item.status_agendamento !== statusAgendamentoSelecionado) {
            return false;
        }

        if (salaSelecionada !== "" && item.cod_sala.toString() !== salaSelecionada) {
            return false;
        }

        if (horarioInicialSelecionado !== "" && new Date(item.horario_inicial) < new Date(horarioInicialSelecionado)) {
            return false;
        }

        if (horarioFinalSelecionado !== "" && new Date(item.horario_final) > new Date(horarioFinalSelecionado)) {
            return false;
        }

        return true
    });

    const ExportarParaExcel = () => {
        const dados = RelatorioFiltrado.map(item => ({
            "ID Agendamento": item.cod_agendamento,
            "ID Usuário": item.agendado_por,
            "Usuário": item.nome,
            "ID Sala": item.cod_sala,
            "Sala": item.sala,
            "Horário inicial": new Date(item.horario_inicial).toLocaleString(
                "pt-BR",
                {
                    dateStyle: "short",
                    timeStyle: "short",
                }
            ),
            "Horário final": new Date(item.horario_final).toLocaleString(
                "pt-BR",
                {
                    dateStyle: "short",
                    timeStyle: "short",
                }
            ),
            "Status do agendamento": item.status_agendamento,
            "Data de criação": new Date(item.created_at).toLocaleString(
                "pt-BR",
                {
                    dateStyle: "short",
                    timeStyle: "short",
                }
            ),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dados);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

        XLSX.writeFile(workbook, "relatorio.xlsx");
    };

    if (carregando) {
        return null;
    }

    return (
        <>
            <div className="flex flex-col min-h-screen bg-[#FCF9F2] text-dark dark:text-white dark:bg-[#191A2C] transition-colors duration-200 ease-in-out">
                <Navbar />
                <div className="p-8 gap-4 flex flex-col">
                    <div className="flex flex-col md:flex-row md:flex-wrap items-end p-4 gap-4 bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] shadow-lg rounded-lg">
                        <div className="flex flex-col md:w-50">
                            <span className="font-medium text-sm text-black dark:text-white">Salas</span>
                            <select
                                className="outline-none border text-sm border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                                name="salasDropDownList"
                                id="SalasDropDownList"
                                value={salaSelecionada}
                                onChange={(e) => setSalaSelecionada(e.target.value)}
                            >
                                <option value=""></option>
                                {salas.map(sala => (
                                    <option
                                        key={sala.cod_sala}
                                        value={sala.cod_sala}
                                    >
                                        {sala.sala}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col md:w-50">
                            <span className="font-medium text-sm text-black dark:text-white">Status de agendamento</span>
                            <select
                                className="outline-none border text-sm border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                                name="statusAgendamentoDropDownList"
                                id="statusAgendamentoDropDownList"
                                value={statusAgendamentoSelecionado}
                                onChange={(e) => setStatusAgendamentoSelecionado(e.target.value)}
                            >
                                <option value=""></option>
                                {statusAgendamento.map(status_agendamento => (
                                    <option
                                        key={status_agendamento.cod_status_agendamento}
                                        value={status_agendamento.status_agendamento}
                                    >
                                        {status_agendamento.status_agendamento}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col md:w-50">
                            <span className="font-medium text-sm text-black dark:text-white">Horário inicial</span>
                            <input
                                className="outline-none border text-sm border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                                type="datetime-local"
                                value={horarioInicialSelecionado}
                                onChange={(e) => setHorarioInicialSelecionado(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col md:w-50">
                            <span className="font-medium text-sm text-black dark:text-white">Horário final</span>
                            <input
                                className="outline-none border text-sm border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                                type="datetime-local"
                                value={horarioFinalSelecionado}
                                onChange={(e) => setHorarioFinalSelecionado(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <button
                                className="border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] cursor-pointer rounded-lg px-2 py-2 transition-colors duration-200 ease-in-out"
                                onClick={ExportarParaExcel}
                            >
                                Exportar
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col p-4 gap-4 bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] shadow-lg rounded-lg overflow-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-[#B19252] dark:border-[#656395] text-left">
                                    <th className="p-3 font-semibold">ID Agendamento</th>
                                    <th className="p-3 font-semibold">ID Usuário</th>
                                    <th className="p-3 font-semibold">Usuário</th>
                                    <th className="p-3 font-semibold">ID Sala</th>
                                    <th className="p-3 font-semibold">Sala</th>
                                    <th className="p-3 font-semibold">Horário inicial</th>
                                    <th className="p-3 font-semibold">Horário final</th>
                                    <th className="p-3 font-semibold">Status do agendamento</th>
                                    <th className="p-3 font-semibold">Data de criação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {relatorio.length > 0 ? (
                                    RelatorioFiltrado.map((item) => (
                                        <tr
                                            key={item.cod_agendamento}
                                            className="border-b border-[#e8d6b5] dark:border-[#4a4964] hover:bg-[#F9F3E8] dark:hover:bg-[#34354A] transition-colors"
                                        >
                                            <td className="p-3 whitespace-nowrap">
                                                {item.cod_agendamento}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {item.agendado_por}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {item.nome}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {item.cod_sala}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {item.sala}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {new Date(
                                                    item.horario_inicial
                                                ).toLocaleString("pt-BR", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                })}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {new Date(
                                                    item.horario_final
                                                ).toLocaleString("pt-BR", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                })}
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${item.status_agendamento === "Agendado"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                        }`}
                                                >
                                                    {item.status_agendamento}
                                                </span>
                                            </td>
                                            <td className="p-3 whitespace-nowrap">
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleString("pt-BR", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                })}
                                            </td>
                                        </tr>
                                    ))) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="p-6 text-center text-[#6b6b6b] dark:text-[#9d9db1]"
                                        >
                                            Nenhuma informação encontrada.
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
