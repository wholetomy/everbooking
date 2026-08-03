"use client";

import { useState, useEffect } from "react";

type UsuariosType = {
  cod_usuario: number;
  nome: string;
  email: string;
  cod_tipo_usuario: number;
  tipo_usuario: string;
  cod_status: number;
  status: string;
  cod_pergunta_secreta: number;
  resposta_secreta: string;
  created_at: string;
};

type PerguntasSecretasType = {
  cod_pergunta_secreta: number;
  pergunta_secreta: string;
};

type TiposUsuarioType = {
  cod_tipo_usuario: number;
  tipo_usuario: string;
};

type StatusType = {
  cod_status: number;
  status: string;
};

export default function AdminUsuarios() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [usuarios, setUsuarios] = useState<UsuariosType[]>([]);
  const [perguntasSecretas, setPerguntasSecretas] = useState<PerguntasSecretasType[]>([]);
  const [tiposUsuario, setTiposUsuario] = useState<TiposUsuarioType[]>([]);
  const [status, setStatus] = useState<StatusType[]>([]);
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [perguntaSecreta, setPerguntaSecreta] = useState<string>("");
  const [respostaSecreta, setRespostaSecreta] = useState<string>("");
  const [tipoUsuario, setTipoUsuario] = useState<string>("");
  const [erroCadastro, setErroCadastro] = useState<string | null>(null);
  const [modalEdicao, setModalEdicao] = useState<boolean>(false);
  const [erroModalEdicao, setErroModalEdicao] = useState<string | null>(null);
  const [edicaoNome, setEdicaoNome] = useState<string>("");
  const [edicaoEmail, setEdicaoEmail] = useState<string>("");
  const [edicaoSenha, setEdicaoSenha] = useState<string>("");
  const [edicaoPerguntaSecreta, setEdicaoPerguntaSecreta] = useState<string>("");
  const [edicaoRespostaSecreta, setEdicaoRespostaSecreta] = useState<string>("");
  const [edicaoTipoUsuario, setEdicaoTipoUsuario] = useState<string>("");
  const [edicaoStatus, setEdicaoStatus] = useState<string>("");
  const [edicaoCodUsuario, setEdicaoCodUsuario] = useState<number | null>(null);

  useEffect(() => {
    PreencherTabelaDeUsuarios();
    PreencherPerguntasSecretas();
    PreencherTiposDeUsuario();
    PreencherStatus();
  }, []);

  const PreencherTabelaDeUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/usuarios`, {
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

      setUsuarios(result);

    } catch (e) {
      console.error(e);
    }
  };

  const PreencherPerguntasSecretas = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/perguntas-secretas`, {
        credentials: "include",
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.detail);
      }

      const result = await response.json()

      setPerguntasSecretas(result);

    } catch (e) {
      console.error(e);
    }
  };

  const PreencherTiposDeUsuario = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/tipos-de-usuario`, {
        credentials: "include",
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.detail);
      }

      const result = await response.json()

      setTiposUsuario(result);

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
    if (!nome || !email || !senha || !tipoUsuario || !perguntaSecreta || !respostaSecreta) {
      setErroCadastro("Todos os campos precisam ser preenchidos.");
      return;
    }

    await CadastrarUsuario();
  };

  const CadastrarUsuario = async () => {
    setErroCadastro(null);

    try {
      const response = await fetch(`${API_URL}/admin/usuarios`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          nome,
          email,
          senha,
          pergunta_secreta: perguntaSecreta,
          resposta_secreta: respostaSecreta,
          tipo_usuario: tipoUsuario
        })
      });

      if (!response.ok) {
        const erro = await response.json();

        if (erro.detail?.[0]?.loc?.includes("email")) {
          setErroCadastro("Informe um e-mail válido.");
          return;
        }

        if (erro.detail === "Usuário já cadastrado.") {
          setErroCadastro("E-mail já cadastrado no sistema.");
          return;
        }

        setErroCadastro("Erro ao cadastrar.");
        return;
      }

      PreencherTabelaDeUsuarios();
      setNome("");
      setEmail("");
      setSenha("");
      setTipoUsuario("");
      setErroCadastro(null);
      setPerguntaSecreta("");
      setRespostaSecreta("");

    } catch (e) {
      if (e instanceof Error) {
        setErroCadastro(e.message);
      } else {
        setErroCadastro("Ocorreu um erro inesperado.");
      }

      console.error(e);
    }
  };

  const VerificarCamposDaEdicao = async () => {
    if (!edicaoNome || !edicaoEmail || !edicaoTipoUsuario || !edicaoPerguntaSecreta || !edicaoRespostaSecreta || !edicaoStatus) {
      setErroModalEdicao("Todos os campos precisam ser preenchidos.");
      return;
    }

    await EditarUsuario();
  };

  const EditarUsuario = async () => {
    setErroModalEdicao(null);

    try {
      const response = await fetch(`${API_URL}/admin/usuarios/${edicaoCodUsuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            nome: edicaoNome,
            email: edicaoEmail,
            senha: edicaoSenha,
            pergunta_secreta: edicaoPerguntaSecreta,
            resposta_secreta: edicaoRespostaSecreta,
            tipo_usuario: edicaoTipoUsuario,
            status: edicaoStatus,
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.json();

        if (erro.detail?.[0]?.loc?.includes("email")) {
          setErroModalEdicao("Informe um e-mail válido.");
          return;
        }

        if (erro.detail === "Email já cadastrado. Por favor, escolha outro e-mail.") {
          setErroModalEdicao("Email já cadastrado. Por favor, escolha outro e-mail.");
          return;
        }

        setErroModalEdicao("Erro ao editar o usuário.");
        return;
      }

      PreencherTabelaDeUsuarios();
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
          <span className="font-medium text-sm text-black dark:text-white">Nome</span>
          <input
            className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full md:w-55">
          <span className="font-medium text-sm text-black dark:text-white">E-mail</span>
          <input
            className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full md:w-55">
          <span className="font-medium text-sm text-black dark:text-white">Senha</span>
          <input
            className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full md:w-55">
          <span className="font-medium text-sm text-black dark:text-white">Tipo de usuário</span>
          <select
            className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
            name="perguntaSecretaDropDownList"
            id="perguntaSecretaDropDownList"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
          >
            <option value=""></option>
            {tiposUsuario.map(item => (
              <option
                key={item.cod_tipo_usuario}
                value={item.cod_tipo_usuario}
              >
                {item.tipo_usuario}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full md:w-55">
          <span className="font-medium text-sm text-black dark:text-white">Pergunta secreta</span>
          <select
            className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
            name="perguntaSecretaDropDownList"
            id="perguntaSecretaDropDownList"
            value={perguntaSecreta}
            onChange={(e) => setPerguntaSecreta(e.target.value)}
          >
            <option value=""></option>
            {perguntasSecretas.map(item => (
              <option
                key={item.cod_pergunta_secreta}
                value={item.cod_pergunta_secreta}
              >
                {item.pergunta_secreta}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full md:w-55">
          <span className="font-medium text-sm text-black dark:text-white">Resposta</span>
          <input
            className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
            type="text"
            value={respostaSecreta}
            onChange={(e) => setRespostaSecreta(e.target.value)}
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
        <h1 className="text-xl font-semibold text-black dark:text-white">Usuários</h1>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#B19252] dark:border-[#656395] text-left">
              <th className="p-3 font-semibold">Nome</th>
              <th className="p-3 font-semibold">E-mail</th>
              <th className="p-3 font-semibold">Tipo</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Criado em</th>
              <th className="p-3 font-semibold">Editar</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map(item => (
                <tr
                  key={item.cod_usuario}
                  className="border-b border-[#e8d6b5] dark:border-[#4a4964] hover:bg-[#F9F3E8] dark:hover:bg-[#34354A] transition-colors"
                >
                  <td className="p-3 font-medium whitespace-nowrap">
                    {item.nome}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    {item.email}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    {item.tipo_usuario}
                  </td>

                  <td className="p-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === "Ativo"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }`}>
                      {item.status}
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
                      className="flex flex-col border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] cursor-pointer rounded-lg px-2 py-1 transition-colors duration-200 ease-in-out"
                      onClick={() => {
                        setEdicaoCodUsuario(item.cod_usuario);
                        setModalEdicao(true);

                        setEdicaoNome(item.nome);
                        setEdicaoEmail(item.email);
                        setEdicaoSenha("");
                        setEdicaoTipoUsuario(String(item.cod_tipo_usuario));
                        setEdicaoPerguntaSecreta(String(item.cod_pergunta_secreta));
                        setEdicaoRespostaSecreta(item.resposta_secreta);
                        setEdicaoStatus(String(item.cod_status));

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
              <h1 className="text-2xl font-semibold tex-black dark:text-white">Editar agendamento</h1>
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
                  value={edicaoNome}
                  onChange={(e) => setEdicaoNome(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Novo e-mail</span>
                <input
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  type="text"
                  value={edicaoEmail}
                  onChange={(e) => setEdicaoEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Nova senha (deixe em branco para manter a atual)</span>
                <input
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  type="password"
                  value={edicaoSenha}
                  onChange={(e) => setEdicaoSenha(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Novo tipo de usuário</span>
                <select
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  value={edicaoTipoUsuario}
                  onChange={(e) => setEdicaoTipoUsuario(e.target.value)}
                >
                  <option value=""></option>
                  {tiposUsuario.map(item => (
                    <option key={item.cod_tipo_usuario} value={item.cod_tipo_usuario}>
                      {item.tipo_usuario}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Nova pergunta secreta</span>
                <select
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  value={edicaoPerguntaSecreta}
                  onChange={(e) => setEdicaoPerguntaSecreta(e.target.value)}
                >
                  <option value=""></option>
                  {perguntasSecretas.map(item => (
                    <option key={item.cod_pergunta_secreta} value={item.cod_pergunta_secreta}>
                      {item.pergunta_secreta}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Nova resposta</span>
                <input
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  type="text"
                  value={edicaoRespostaSecreta}
                  onChange={(e) => setEdicaoRespostaSecreta(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-black dark:text-white">Novo status</span>
                <select
                  className="outline-none border border-[#989898] p-2 focus:border-[#B19252] focus:dark:border-[#636693] transition-colors duration-200 ease-in-out"
                  value={edicaoStatus}
                  onChange={(e) => setEdicaoStatus(e.target.value)}
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
                  onClick={VerificarCamposDaEdicao}
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
