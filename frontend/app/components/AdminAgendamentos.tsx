"use client";

import { useState, useEffect } from "react";

type AgendamentosType = {
  cod_agendamento: number;
  cod_sala: number;
  sala: string;
  horario_inicial: string;
  horario_final: string;
  cod_status_agendamento: number;
  status_agendamento: string;
  created_at: string;
};

type SalasType = {
  cod_sala: number;
  sala: string;
};

export default function AdminAgendamentos() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [agendamentos, setAgendamentos] = useState<AgendamentosType[]>([]);
  const [salas, setSalas] = useState<SalasType[]>([]);

  const [modalEdicao, setModalEdicao] = useState<boolean>(false);
  const [erroModalEdicao, setErroModalEdicao] = useState<string | null>(null);
  const [edicaoCodAgendamento, setEdicaoCodAgendamento] = useState<number | null>(null);

  const [modalCancelamento, setModalCancelamento] = useState<boolean>(false);

  const [edicaoSala, setEdicaoSala] = useState<string>("");
  const [edicaoHorarioInicial, setEdicaoHorarioInicial] = useState<string>("");
  const [edicaoHorarioFinal, setEdicaoHorarioFinal] = useState<string>("");
  const [edicaoStatusDoAgendamento, setEdicaoStatusDoAgendamento] = useState<string>("");

  useEffect(() => {
    PreencherAgendamentos();
    PreencherSalas();
  }, []);

  const PreencherAgendamentos = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/agendamentos`, {
        credentials: "include",
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.detail);
      }

      const result = await response.json()

      setAgendamentos(result);

    } catch (e) {
      console.error(e);
    }
  };

  const PreencherSalas = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/salas-ativas`, {
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

  const VerificarCamposDeEdicao = async () => {
    if (!edicaoSala || !edicaoHorarioInicial || !edicaoHorarioFinal) {
      setErroModalEdicao("Todos os campos precisam ser preenchidos")
      return;
    }

    if (edicaoHorarioInicial >= edicaoHorarioFinal) {
      setErroModalEdicao("O horário inicial deve ser menor que o horário final.");
      return;
    }

    await EditarAgendamento();
  };

  const EditarAgendamento = async () => {
    setErroModalEdicao(null);

    try {
      const response = await fetch(`${API_URL}/admin/agendamentos/${edicaoCodAgendamento}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            cod_agendamento: Number(edicaoCodAgendamento),
            cod_sala: edicaoSala,
            horario_inicial: edicaoHorarioInicial,
            horario_final: edicaoHorarioFinal,
            status_agendamento: edicaoStatusDoAgendamento,
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.json();

        if (erro.detail === "Agendamento não encontrado.") {
          setErroModalEdicao("Agendamento não encontrado.");
          return;
        }

        if (erro.detail === "Não é possível editar um agendamento cancelado.") {
          setErroModalEdicao("Não é possível editar um agendamento cancelado.");
          return;
        }

        if (erro.detail === "O horário final deve ser maior que o horário inicial.") {
          setErroModalEdicao("O horário final deve ser maior que o horário inicial.");
          return;
        }

        if (erro.detail === "A sala já possui um agendamento nesse horário.") {
          setErroModalEdicao("A sala já possui um agendamento nesse horário.");
          return;
        }

        setErroModalEdicao("Erro ao editar o agendamento.");
        return;
      }

      PreencherAgendamentos();
      setErroModalEdicao(null);
      setModalEdicao(false);

    } catch (e) {
      if (e instanceof Error) {
        setErroModalEdicao(e.message);
      } else {
        setErroModalEdicao("Ocorreu um erro inesperado.");
      }

      console.error(e);
    }
  };

  const CancelarAgendamento = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/agendamentos/${edicaoCodAgendamento}`,
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

      PreencherAgendamentos();
      setModalCancelamento(false);

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex flex-col mt-2 overflow-auto">
        <h1 className="text-xl font-semibold text-black dark:text-white">Agendamentos</h1>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#B19252] dark:border-[#656395] text-left">
              <th className="p-3 font-semibold">Sala</th>
              <th className="p-3 font-semibold">Horário inicial</th>
              <th className="p-3 font-semibold">Horário final</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Criado em</th>
              <th className="p-3 font-semibold">Editar</th>
              <th className="p-3 font-semibold">Cancelar</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.length > 0 ? (
              agendamentos.map(item => (
                <tr
                  key={item.cod_agendamento}
                  className="border-b border-[#e8d6b5] dark:border-[#4a4964] hover:bg-[#F9F3E8] dark:hover:bg-[#34354A] transition-colors"
                >
                  <td className="p-3 font-medium whitespace-nowrap">
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
                  <td className="p-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status_agendamento === "Agendado"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }`}>
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
                  <td className="p-3 whitespace-nowrap">
                    <button
                      className={`flex flex-col ${item.status_agendamento !== "Agendado" ? "bg-gray-400 text-white border border-bg-gray-600 cursor-not-allowed" : "border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] cursor-pointer"} rounded-lg px-2 py-1 transition-colors duration-200 ease-in-out`}
                      disabled={item.status_agendamento !== "Agendado"}
                      onClick={() => {
                        setEdicaoCodAgendamento(item.cod_agendamento);

                        setEdicaoSala(String(item.cod_sala));
                        setEdicaoHorarioInicial(item.horario_inicial.slice(0, 16));
                        setEdicaoHorarioFinal(item.horario_final.slice(0, 16));
                        setEdicaoStatusDoAgendamento(String(item.cod_status_agendamento));

                        setErroModalEdicao(null);
                        setModalEdicao(true);
                      }}
                    >
                      Editar
                    </button>
                  </td>
                  <td className="p-3 font-medium whitespace-nowrap">
                    <button
                      className={`${item.status_agendamento !== "Agendado" ? "bg-gray-400 text-white border border-bg-gray-600 cursor-not-allowed" : "bg-red-700 hover:bg-red-800 text-white"} rounded-lg px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out`}
                      disabled={item.status_agendamento !== "Agendado"}
                      onClick={() => {
                        setModalCancelamento(true);
                        setEdicaoCodAgendamento(item.cod_agendamento);
                      }}
                    >
                      Cancelar
                    </button>
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
      {modalEdicao && (
        <>
          <div className="fixed bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full min-h-screen z-10" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-100 max-h-[90vh] overflow-y-auto rounded-lg p-6 bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] shadow-xl z-20 transition-colors duration-200 ease-in-out">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
              <h1 className="text-2xl font-semibold tex-black dark:text-white">Editar sala</h1>
              <button
                className="bg-red-700 hover:bg-red-800 text-white rounded-lg px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out"
                onClick={() => setModalEdicao(false)}
              >
                Fechar
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Nova sala</span>
                <select
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  value={edicaoSala}
                  onChange={(e) => setEdicaoSala(e.target.value)}
                >
                  <option value=""></option>
                  {salas.map(item => (
                    <option key={item.cod_sala} value={item.cod_sala}>
                      {item.sala}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Novo horário inicial</span>
                <input
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  type="datetime-local"
                  value={edicaoHorarioInicial}
                  onChange={(e) => setEdicaoHorarioInicial(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Novo horário final</span>
                <input
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  type="datetime-local"
                  value={edicaoHorarioFinal}
                  onChange={(e) => setEdicaoHorarioFinal(e.target.value)}
                />
              </div>
              <div>
                <button
                  className="flex flex-col w-full border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] font-medium rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out"
                  onClick={VerificarCamposDeEdicao}
                >
                  Salvar
                </button>
              </div>
              {erroModalEdicao && (
                <div className="rounded border mt-2 border-red-400 bg-red-100 p-2 text-sm text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300">
                  {erroModalEdicao}
                </div>
              )}
            </div>
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
    </>
  )
}
