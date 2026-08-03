"use client";

import { useState, useEffect } from "react";

type LocalizacoesType = {
  cod_localizacao: number;
  localizacao: string;
  cod_status: number;
  status: string;
  created_at: string;
};

type StatusType = {
  cod_status: number;
  status: string;
};

export default function AdminLocalizacao() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [localizacoes, setLocalizacoes] = useState<LocalizacoesType[]>([]);
  const [status, setStatus] = useState<StatusType[]>([]);

  const [nomeLocalizacao, setNomeLocalizacao] = useState<string>("");
  const [erroCadastro, setErroCadastro] = useState<string | null>(null);

  const [modalEdicao, setModalEdicao] = useState<boolean>(false);
  const [erroModalEdicao, setErroModalEdicao] = useState<string | null>(null);
  const [edicaoCodLocalizacao, setEdicaoCodLocalizacao] = useState<number | null>(null);

  const [edicaoNomeLocalizacao, setEdicaoNomeLocalizacao] = useState<string>("");
  const [edicaoStatusLocalizacao, setEdicaoStatusLocalizacao] = useState<string>("");

  useEffect(() => {
    PreencherTabelaDeLocalizacoes();
    PreencherStatus();
  }, []);

  const PreencherTabelaDeLocalizacoes = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/localizacoes/tabela`, {
        credentials: "include",
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.detail);
      }

      const result = await response.json()

      setLocalizacoes(result);

    } catch (e) {
      console.error(e);
    }
  };

  const PreencherStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/status`, {
        credentials: "include",
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.detail);
      }

      const result = await response.json()

      setStatus(result);

    } catch (e) {
      console.error(e);
    }
  };

  const VerificarCamposDoCadastro = async () => {
    if (!nomeLocalizacao) {
      setErroCadastro("Todos os campos precisam ser preenchidos.");
      return;
    }

    await CadastrarLocalizacao();
  };

  const CadastrarLocalizacao = async () => {
    setErroCadastro(null);

    try {
      const response = await fetch(`${API_URL}/admin/localizacao`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          localizacao: nomeLocalizacao,
        })
      });

      if (!response.ok) {
        const erro = await response.json();

        if (erro.detail === "A localização já existe") {
          setErroCadastro("A localização já existe");
          return;
        }

        setErroCadastro("Erro ao cadastrar.");
        return;
      }

      PreencherTabelaDeLocalizacoes();
      setNomeLocalizacao("");
      setErroCadastro(null);

    } catch (e) {
      if (e instanceof Error) {
        setErroCadastro(e.message);
      } else {
        setErroCadastro("Ocorreu um erro inesperado.");
      }

      console.error(e);
    }
  };

  const VerificarCamposDeEdicao = async () => {
    if (!edicaoNomeLocalizacao || !edicaoStatusLocalizacao) {
      setErroModalEdicao("Todos os campos precisam ser preenchidos.");
      return;
    }

    await EditarLocalizacao();
  };

  const EditarLocalizacao = async () => {
    setErroModalEdicao(null);

    try {
      const response = await fetch(`${API_URL}/admin/localizacao/${edicaoCodLocalizacao}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            localizacao: edicaoNomeLocalizacao,
            status: edicaoStatusLocalizacao
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.json();

        if (erro.detail === "A localização não existe.") {
          setErroModalEdicao("A localização não existe.");
          return;
        }

        if (erro.detail === "A localização já existe") {
          setErroModalEdicao("A localização já existe");
          return;
        }

        setErroModalEdicao("Erro ao editar a localização.");
        return;
      }

      PreencherTabelaDeLocalizacoes();
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

  return (
    <>
      <h1 className="text-xl font-semibold text-black dark:text-white">Cadastro</h1>
      <div className="flex flex-wrap gap-2 mt-2 items-end">
        <div className="flex flex-col w-full md:w-55">
          <span className="font-medium text-sm text-black dark:text-white">Nome da localização</span>
          <input
            className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
            type="text"
            value={nomeLocalizacao}
            onChange={(e) => setNomeLocalizacao(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full md:w-auto">
          <button
            className="flex w-full flex-col border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200 ease-in-out"
            onClick={VerificarCamposDoCadastro}
          >
            Cadastrar
          </button>
        </div>
      </div>
      {erroCadastro && (
        <div className="rounded border mt-2 border-red-400 bg-red-100 p-2 text-sm text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300">
          {erroCadastro}
        </div>
      )}
      <div className="flex flex-col mt-2 overflow-auto">
        <h1 className="text-xl font-semibold text-black dark:text-white">Localizações</h1>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#B19252] dark:border-[#656395] text-left">
              <th className="p-3 font-semibold">Localização</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Criado em</th>
              <th className="p-3 font-semibold">Editar</th>
            </tr>
          </thead>
          <tbody>
            {localizacoes.length > 0 ? (
              localizacoes.map((item) => (
                <tr
                  key={item.cod_localizacao}
                  className="border-b border-[#e8d6b5] dark:border-[#4a4964] hover:bg-[#F9F3E8] dark:hover:bg-[#34354A] transition-colors"
                >
                  <td className="p-3 font-medium whitespace-nowrap">
                    {item.localizacao}
                  </td>

                  <td className="p-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === "Ativo"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <button
                      className="flex flex-col border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] cursor-pointer rounded-lg px-2 py-1 transition-colors duration-200 ease-in-out"
                      onClick={() => {
                        setEdicaoCodLocalizacao(item.cod_localizacao);
                        setModalEdicao(true);

                        setEdicaoNomeLocalizacao(item.localizacao);
                        setEdicaoStatusLocalizacao(String(item.cod_status));
                        setErroModalEdicao(null);
                      }}
                    >
                      Editar
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
              <h1 className="text-2xl font-semibold tex-black dark:text-white">Editar localização</h1>
              <button
                className="bg-red-700 hover:bg-red-800 text-white rounded-lg px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out"
                onClick={() => setModalEdicao(false)}
              >
                Fechar
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Novo nome</span>
                <input
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  type="text"
                  value={edicaoNomeLocalizacao}
                  onChange={(e) => setEdicaoNomeLocalizacao(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Novo status</span>
                <select
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  value={edicaoStatusLocalizacao}
                  onChange={(e) => setEdicaoStatusLocalizacao(e.target.value)}
                >
                  <option value=""></option>
                  {status.map(item => (
                    <option key={item.cod_status} value={item.cod_status}>
                      {item.status}
                    </option>
                  ))}
                </select>
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
    </>
  )
}
