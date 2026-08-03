"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Navbar from "../components/Navbar";

type Salas = {
  cod_sala: number;
  sala: string;
  descricao: string;
  localizacao: string;
  capacidade: string;
  imagem: string;
  status: string;
  created_at: string;
}

export default function Home() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [salas, setSalas] = useState<Salas[]>([]);
  const [isFetchDone, setIsFetchDone] = useState<boolean>(true);
  const [filtro, setFiltro] = useState<string>("");

  useEffect(() => {
    TrazerTodasAsSalas();
  }, []);

  const TrazerTodasAsSalas = async () => {
    try {
      setIsFetchDone(false);

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

      setIsFetchDone(true);

      const result = await response.json();

      setSalas(result);

    } catch (e) {
      console.error(e);
    }
  };

  const RedirecionarParaTelaDaSala = (valor: string) => {
    router.push(`/sala/${valor}`);
  };

  const salasFiltradas = salas.filter((sala) =>
    sala.sala.toLowerCase().includes(filtro.toLowerCase())
  );

  if (!isFetchDone) {
    return (
      <>
        <div className="min-h-screen bg-[#FCF9F2] dark:bg-[#191A2C] text-white transition-colors duration-200 ease-in-out">
          <Navbar />
          <span className="text-white">Loading...</span>
          {/* talvez um botão de "tentar de novo aqui" */}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#FCF9F2] dark:bg-[#191A2C] text-white transition-colors duration-200 ease-in-out">
        <Navbar />
        <div className="w-full p-8 flex flex-col gap-4 items-center">
          <input
            type="text"
            className="w-full md:w-125 bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-white outline-none px-4 py-2.5 rounded-lg shadow-lg transition duration-200 ease-in-out"
            value={filtro}
            placeholder="Pesquisar salas"
            onChange={(e) => setFiltro(e.target.value)}
          />
          {salasFiltradas.map(sala => (
            <div
              key={sala.cod_sala}
              className="bg-[#FEFDFB] text-[#181715] dark:bg-[#2A2939] dark:text-[#B4B3C1] lg:min-w-250 md:min-w-192 min-w-full p-4 rounded-lg flex flex-col md:flex-row gap-4 shadow-lg"
            >
              <div className="md:w-[200px] md:h-[150px] w-full h-48 flex justify-center items-center overflow-hidden">
                <img
                  src={sala.imagem}
                  alt="imagem da sala"
                  className="h-full w-full object-cover hover:scale-125 transition duration-200 ease-in-out"
                />
              </div>
              <div className="flex flex-col w-full justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between flex-wrap gap-2">
                    <span
                      className="font-bold text-xl text-black dark:text-white"
                    >
                      {sala.sala}
                    </span>
                    <span
                      className="bg-[#F4E9D7] text-[#5D4E39] dark:bg-[#373644] dark:text-[#C4C6DB] rounded-2xl px-3"
                    >
                      Capacidade: {sala.capacidade} {Number(sala.capacidade) === 1 ? "pessoa" : "pessoas"}
                    </span>
                  </div>
                  <div>
                    <span>Localização: {sala.localizacao}</span>
                  </div>

                </div>
                <div className="w-full flex justify-end">
                  <button
                    className="flex flex-col border dark:border-[#656395] border-[#B19252] bg-[#C39951] hover:bg-[#B19252] text-white dark:text-[#DFDFEB] dark:bg-[#282A39] hover:dark:bg-[#656395] rounded-lg px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out"
                    onClick={() => { RedirecionarParaTelaDaSala(String(sala.cod_sala)) }}
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}