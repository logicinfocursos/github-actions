"use client";

import { useState } from "react";

// Função matemática para validação real de CPF
const validarCPF = (cpf) => {
  const limpo = cpf.replace(/[^\d]+/g, "");
  if (limpo.length !== 11 || !!limpo.match(/(\d)\1{10}/)) return false;
  
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) soma += parseInt(limpo.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(limpo.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo.substring(10, 11))) return false;
  
  return true;
};

// Validação de Nome e Sobrenome (mínimo 3 caracteres cada)
const validarNome = (nome) => {
  const partes = nome.trim().split(/\s+/);
  if (partes.length < 2) return false;
  return partes.every(parte => parte.length >= 3);
};

// Validação básica de formato de Email
const validarEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function Home() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    nivel: "",
    termos: false,
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Mensagens de erro dinâmicas (só aparecem se o usuário digitou algo)
  const erros = {
    nome: formData.nome && !validarNome(formData.nome) ? "Informe nome e sobrenome (mínimo 3 letras cada)." : "",
    email: formData.email && !validarEmail(formData.email) ? "Informe um e-mail válido." : "",
    cpf: formData.cpf && !validarCPF(formData.cpf) ? "Informe um CPF válido com 11 dígitos." : "",
  };

  // O formulário só é válido se passar em todas as funções e regras
  const isFormValid = 
    validarNome(formData.nome) && 
    validarEmail(formData.email) && 
    validarCPF(formData.cpf) && 
    formData.nivel && 
    formData.termos;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setEnviado(true);
    }
  };

  const handleReset = () => {
    setFormData({ nome: "", email: "", cpf: "", nivel: "", termos: false });
    setEnviado(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Cadastro de Dev v10
        </h1>

        {enviado ? (
          <div className="text-center py-4" id="success-section">
            <div id="success-message" className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg font-semibold">
              ¡Inscrição realizada com sucesso! 🎉
            </div>
            <button onClick={handleReset} id="btn-reset" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition">
              Voltar/Resetar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: João Silva" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {erros.nome && <p id="error-nome" className="text-red-500 text-xs mt-1 font-medium">{erros.nome}</p>}
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {erros.email && <p id="error-email" className="text-red-500 text-xs mt-1 font-medium">{erros.email}</p>}
            </div>

            {/* Campo CPF */}
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF (Apenas números)</label>
              <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="00000000000" maxLength={11} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {erros.cpf && <p id="error-cpf" className="text-red-500 text-xs mt-1 font-medium">{erros.cpf}</p>}
            </div>

            {/* Campo Nível */}
            <div>
              <label htmlFor="nivel" className="block text-sm font-medium text-gray-700 mb-1">Nível de Experiência</label>
              <select id="nivel" name="nivel" value={formData.nivel} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Selecione...</option>
                <option value="junior">Junior</option>
                <option value="pleno">Pleno</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            {/* Checkbox Termos */}
            <div className="flex items-start mt-2">
              <input id="termos" name="termos" type="checkbox" checked={formData.termos} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5" />
              <label htmlFor="termos" className="ml-3 text-sm font-medium text-gray-700">Aceito os termos e condições</label>
            </div>

            {/* Botão de Enviar condicional */}
            <button
              type="submit"
              id="btn-enviar"
              disabled={!isFormValid}
              className={`w-full mt-4 text-white font-medium py-2 px-4 rounded-lg transition ${
                isFormValid ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Enviar Inscrição
            </button>
          </form>
        )}
      </div>
    </main>
  );
}