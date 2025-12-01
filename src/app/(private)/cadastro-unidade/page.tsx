"use client";
import { useState } from "react";

export default function CadastroUnidade() {
  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    responsavel: "",
    telefone: "",
    obs: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/unidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-red-500 uppercase">
            Cadastro
          </p>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold text-zinc-50">
            Cadastro de Unidades
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Registre as unidades com dados completos para facilitar a gestão.
          </p>
        </div>

        <div className="rounded-2xl border border-red-900/40 bg-black/70 shadow-[0_18px_50px_rgba(0,0,0,0.7)] backdrop-blur">
          <form onSubmit={handleSubmit} className="p-6 md:p-7 space-y-5">
            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-100">
                Nome da Unidade
              </label>
              <input
                type="text"
                name="nome"
                required
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none
                           focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition"
                placeholder="Ex.: Escola Municipal João da Silva"
              />
            </div>

            {/* Endereço + Cidade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-zinc-100">
                  Endereço
                </label>
                <input
                  type="text"
                  name="endereco"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none
                             focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition"
                  placeholder="Rua, número, bairro"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-100">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none
                             focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition"
                  placeholder="Ex.: Piracicaba"
                />
              </div>
            </div>

            {/* Responsável + Telefone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-100">
                  Responsável
                </label>
                <input
                  type="text"
                  name="responsavel"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none
                             focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition"
                  placeholder="Nome do responsável"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-100">
                  Telefone
                </label>
                <input
                  type="text"
                  name="telefone"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none
                             focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition"
                  placeholder="(xx) xxxxx-xxxx"
                />
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-100">
                Observações
              </label>
              <textarea
                name="obs"
                rows={3}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none
                           focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition resize-none"
                placeholder="Informações adicionais sobre a unidade..."
              />
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-zinc-50
                         shadow-[0_10px_30px_rgba(220,38,38,0.55)] transition
                         hover:bg-red-500 hover:shadow-[0_12px_40px_rgba(220,38,38,0.65)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Salvar Unidade
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
