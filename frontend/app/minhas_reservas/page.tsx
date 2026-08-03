"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

type Salas = {
  cod_sala: number;
  sala: string;
};

type StatusDeAgendamento = {
  cod_status_agendamento: number;
  status_agendamento: string;
};

type MeusAgendamentos = {
  cod_agendamento: number;
  cod_sala: number;
  sala: string;
  horario_inicial: string;
  horario_final: string;
  status_agendamento: string;
  created_at: string;
};

export default function MinhasReservas() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [erro, setErro] = useState<string | null>(null);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [modalCancelamento, setModalCancelamento] = useState<boolean>(false);
  const [salas, setSalas] = useState<Salas[]>([]);
  const [statusAgendamento, setStatusAgendamento] = useState<StatusDeAgendamento[]>([]);
  const [meusAgendamentos, setMeusAgendamentos] = useState<MeusAgendamentos[]>([]);
  const [salaSelecionada, setSalaSelecionada] = useState("");
  const [statusAgendamentoSelecionado, setStatusAgendamentoSelecionado] = useState<string>("");
  const [horarioInicialSelecionado, setHorarioInicialSelecionado] = useState("");
  const [horarioFinalSelecionado, setHorarioFinalSelecionado] = useState("");
  const [novoHorarioInicial, setNovoHorarioInicial] = useState<string>("");
  const [novoHorarioFinal, setNovoHorarioFinal] = useState<string>("");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<MeusAgendamentos | null>(null);

  useEffect(() => {
    PreencherSalas();
    PreencherStatusDeAgendamento();
    PesquisarMeusAgendamentos();
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

  const agendamentosFiltrados = meusAgendamentos.filter((agendamento) => {
    if (statusAgendamentoSelecionado !== "" && agendamento.status_agendamento !== statusAgendamentoSelecionado) {
      return false;
    }

    if (salaSelecionada !== "" && agendamento.cod_sala.toString() !== salaSelecionada) {
      return false;
    }

    if (horarioInicialSelecionado !== "" && new Date(agendamento.horario_inicial) < new Date(horarioInicialSelecionado)) {
      return false;
    }

    if (horarioFinalSelecionado !== "" && new Date(agendamento.horario_final) > new Date(horarioFinalSelecionado)) {
      return false;
    }

    return true

  });

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

  const PesquisarMeusAgendamentos = async () => {
    try {
      const response = await fetch(`${API_URL}/agendamentos/me`, {
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

      setMeusAgendamentos(result);

    } catch (e) {
      console.error(e);
    }
  };

  const VerificarEdicaoDeAgendamento = async () => {
    if (!novoHorarioInicial || !novoHorarioFinal) {
      setErroModal("Todos os campos precisam ser preenchidos.");
      return;
    }

    if (novoHorarioInicial >= novoHorarioFinal) {
      setErroModal("O horário inicial deve ser menor que o horário final.");
      return;
    }

    await EditarAgendamento();
  };

  const EditarAgendamento = async () => {
    try {
      const response = await fetch(
        `${API_URL}/agendamentos/${agendamentoSelecionado?.cod_agendamento}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            horario_inicial: novoHorarioInicial,
            horario_final: novoHorarioFinal,
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.json();

        if (typeof erro.detail === "string") {
          setErroModal(erro.detail);
          return;
        }

        setErroModal("Não foi possível editar o agendamento.");
        return;
      }

      setErroModal(null);
      setModal(false);

      await PesquisarMeusAgendamentos();

      setNovoHorarioInicial("");
      setNovoHorarioFinal("");
      setAgendamentoSelecionado(null);

    } catch (e) {
      console.error(e);

      if (e instanceof Error) {
        setErroModal(e.message);
      } else {
        setErroModal("Ocorreu um erro inesperado.");
      }
    }
  };

  const CancelarAgendamento = async () => {
    try {
      const response = await fetch(
        `${API_URL}/agendamentos/${agendamentoSelecionado?.cod_agendamento}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        console.log("Erro ao cancelar o agendamento: ", erro);
        return;
      }

      await PesquisarMeusAgendamentos();

      setNovoHorarioInicial("");
      setNovoHorarioFinal("");
      setAgendamentoSelecionado(null);

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#FCF9F2] text-dark dark:text-white dark:bg-[#191A2C] transition-colors duration-200 ease-in-out">
        <Navbar />
        <div className="p-8 gap-4 flex flex-col">
          <div className="flex flex-col md:flex-row md:flex-wrap p-4 gap-4 bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] shadow-lg rounded-lg">
            <div className="flex flex-col md:w-50">
              <span className="font-medium text-sm text-black dark:text-white">Salas</span>
              <select
                className="outline-none text-sm border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
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
                className="outline-none text-sm border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
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
                className="outline-none text-sm border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                type="datetime-local"
                value={horarioInicialSelecionado}
                onChange={(e) => setHorarioInicialSelecionado(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:w-50">
              <span className="font-medium text-sm text-black dark:text-white">Horário final</span>
              <input
                className="outline-none text-sm border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                type="datetime-local"
                value={horarioFinalSelecionado}
                onChange={(e) => setHorarioFinalSelecionado(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col p-4 gap-4 bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] shadow-lg rounded-lg overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#B19252] dark:border-[#656395] text-left">
                  <th className="p-3 font-semibold">Sala</th>
                  <th className="p-3 font-semibold">Início</th>
                  <th className="p-3 font-semibold">Fim</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Editar</th>
                  <th className="p-3 font-semibold">Cancelar</th>
                </tr>
              </thead>
              <tbody>
                {meusAgendamentos.length > 0 ? (
                  agendamentosFiltrados.map((agendamento) => (
                    <tr
                      key={agendamento.cod_agendamento}
                      className="border-b border-[#e8d6b5] dark:border-[#4a4964] hover:bg-[#F9F3E8] dark:hover:bg-[#34354A] transition-colors"
                    >

                      <td className="p-3 font-medium whitespace-nowrap">
                        {agendamento.sala}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {new Date(
                          agendamento.horario_inicial
                        ).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {new Date(
                          agendamento.horario_final
                        ).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>

                      <td className="p-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${agendamento.status_agendamento === "Agendado"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                        >
                          {agendamento.status_agendamento}
                        </span>
                      </td>
                      <td className="p-3 font-medium whitespace-nowrap">
                        <button
                          className={`flex flex-col ${agendamento.status_agendamento !== "Agendado" ? "bg-gray-400 text-white border border-bg-gray-600 cursor-not-allowed" : "border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] cursor-pointer"} rounded-lg px-2 py-1 transition-colors duration-200 ease-in-out`}
                          disabled={agendamento.status_agendamento !== "Agendado"}
                          onClick={() => {
                            setAgendamentoSelecionado(agendamento);
                            setNovoHorarioInicial(agendamento.horario_inicial.slice(0, 16));
                            setNovoHorarioFinal(agendamento.horario_final.slice(0, 16));
                            setErroModal(null);
                            setModal(true);
                          }}
                        >
                          Editar
                        </button>
                      </td>
                      <td className="p-3 font-medium whitespace-nowrap">
                        <button
                          className={`${agendamento.status_agendamento !== "Agendado" ? "bg-gray-400 text-white border border-bg-gray-600 cursor-not-allowed" : "bg-red-700 hover:bg-red-800 text-white"} rounded-lg px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out`}
                          disabled={agendamento.status_agendamento !== "Agendado"}
                          onClick={() => {
                            setAgendamentoSelecionado(agendamento);
                            setModalCancelamento(true);
                          }}
                        >
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
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

        {modal && (
          <>
            <div className="fixed bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full min-h-screen z-10" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-100 max-h-[90vh] overflow-y-auto rounded-lg p-6 bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] shadow-xl z-20 transition-colors duration-200 ease-in-out">
              <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
                <h1 className="text-2xl font-semibold tex-black dark:text-white">Editar agendamento</h1>
                <button
                  className="bg-red-700 hover:bg-red-800 text-white rounded-lg px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out"
                  onClick={() => setModal(false)}
                >
                  Fechar
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <span className="font-medium text-black dark:text-white">Novo horário inicial</span>
                  <input
                    className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                    type="datetime-local"
                    value={novoHorarioInicial}
                    onChange={(e) => setNovoHorarioInicial(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-black dark:text-white">Novo horário final</span>
                  <input
                    className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                    type="datetime-local"
                    value={novoHorarioFinal}
                    onChange={(e) => setNovoHorarioFinal(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    className="flex flex-col w-full border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] font-medium rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out"
                    onClick={VerificarEdicaoDeAgendamento}
                  >
                    Salvar
                  </button>
                </div>
              </div>
              {erroModal && (
                <div className="rounded border mt-2 border-red-400 bg-red-100 p-2 text-sm text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300">
                  {erroModal}
                </div>
              )}
            </div>
          </>
        )}

        {modalCancelamento && (
          <>
            <div className="fixed bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full min-h-screen z-10" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-100 max-h-[90vh] overflow-y-auto rounded-lg p-6 bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] shadow-xl z-20 transition-colors duration-200 ease-in-out">
              <div className="mb-2">
                <h1 className="text-2xl font-semibold tex-black dark:text-white">Cancelar agendamento</h1>
              </div>
              <div className="flex flex-col">
                <span>Tem certeza que deseja cancelar esse agendamento?</span>
                <span className="text-red-400">Essa ação não poderá ser desfeita.</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-green-700 hover:bg-green-800 text-white rounded-lg px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out"
                  onClick={() => {
                    CancelarAgendamento();
                    PesquisarMeusAgendamentos();
                    setModalCancelamento(false);
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="bg-red-700 hover:bg-red-800 text-white rounded-lg px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out"
                  onClick={() => setModalCancelamento(false)}
                >
                  Voltar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
