"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    nivel: "",
    termos: false,
  });
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação simples para testar caminhos de erro no Playwright
    if (!formData.nome || !formData.email || !formData.nivel || !formData.termos) {
      setErro("Por favor, preencha todos os campos e aceite os termos.");
      setEnviado(false);
      return;
    }

    setErro("");
    setEnviado(true);
  };

  const handleReset = () => {
    setFormData({ nome: "", email: "", nivel: "", termos: false });
    setEnviado(false);
    setErro("");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Cadastro de Dev - versão alterada para testes de rollback - try 8*
        </h1>

        {/* Mensagem de Erro */}
        {erro && (
          <div id="error-message" className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
            {erro}
          </div>
        )}

        {/* Mensagem de Sucesso */}
        {enviado ? (
          <div className="text-center py-4" id="success-section">
            <div id="success-message" className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg font-semibold">
              ¡Inscrição realizada com sucesso! 🎉
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Obrigado, <span className="font-bold">{formData.nome}</span>.
            </p>
            <button
              onClick={handleReset}
              id="btn-reset"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition"
            >
              Voltar/Resetar
            </button>
          </div>
        ) : (
          /* Formulário */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input de Texto */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite seu nome"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Input de Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Select (Dropdown) */}
            <div>
              <label htmlFor="nivel" className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Experiência
              </label>
              <select
                id="nivel"
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecione...</option>
                <option value="junior">Junior</option>
                <option value="pleno">Pleno</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            {/* Checkbox */}
            <div className="flex items-start mt-2">
              <div className="flex items-center h-5">
                <input
                  id="termos"
                  name="termos"
                  type="checkbox"
                  checked={formData.termos}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termos" className="font-medium text-gray-700">
                  Aceito os termos e condições
                </label>
              </div>
            </div>

            {/* Botão de Submit */}
            <button
              type="submit"
              id="btn-enviar"
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Enviar Inscrição
            </button>
          </form>
        )}
      </div>
    </main>
  );
}