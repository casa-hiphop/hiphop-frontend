'use client'

import React, { useState } from 'react';
import { Wrench, Tag, FileText, Hash, Calendar, Save, Camera } from 'lucide-react';

interface Ferramenta {
  nome: string;
  categoria: string;
  descricao: string;
  quantidade: number;
  dataAquisicao: string;
}

const INITIAL_STATE: Ferramenta = {
  nome: '',
  categoria: '',
  descricao: '',
  quantidade: 1,
  dataAquisicao: new Date().toISOString().substring(0, 10),
};

export const ToolRegisterComponent = () => {
  const [formData, setFormData] = useState<Ferramenta>(INITIAL_STATE);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' }>({ text: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagem, setImagem] = useState<File | null>(null); // NOVO ESTADO PARA O ARQUIVO
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria || formData.quantidade <= 0) {
      setMessage({ text: 'Por favor, preencha todos os campos obrigatórios.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: 'Enviando dados da ferramenta...', type: 'info' });
    
    try {
      console.log('Dados enviados:', formData);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setMessage({ text: `Ferramenta "${formData.nome}" cadastrada com sucesso!`, type: 'success' });
      setFormData(INITIAL_STATE);
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Falha ao cadastrar. Verifique a conexão.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageStyles = {
    success: 'bg-green-100 text-green-800 border-green-400',
    error: 'bg-red-100 text-red-800 border-red-400',
    info: 'bg-blue-100 text-blue-800 border-blue-400',
  };

  return (
    <div className="min-h-screenflex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl p-6 sm:p-8">

        <div className="flex items-center space-x-4 mb-8 border-b pb-4">
          <Wrench className="w-10 h-10 text-red-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">Cadastro de Ferramenta</h1>
        </div>

        {message.text && (
          <div className={`p-4 mb-6 rounded-lg border-l-4 ${messageStyles[message.type]}`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Ferramenta <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-gray-50 text-gray-500">
                <Wrench className="w-5 h-5" />
              </span>
              <input
                type="text"
                name="nome"
                id="nome"
                value={formData.nome}
                onChange={handleTextChange}
                required
                className="flex-1 block w-full rounded-none rounded-r-lg border-gray-300 p-3"
                placeholder="Ex: Furadeira de Impacto"
              />
            </div>
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-gray-50 text-gray-500">
                <Tag className="w-5 h-5" />
              </span>
              <input
                type="text"
                name="categoria"
                id="categoria"
                value={formData.categoria}
                onChange={handleTextChange}
                required
                className="flex-1 block w-full rounded-none rounded-r-lg border-gray-300 p-3"
                placeholder="Ex: Elétrica, Manual..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição Detalhada
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-gray-50 text-gray-500 pt-3">
                <FileText className="w-5 h-5" />
              </span>
              <textarea
                id="descricao"
                name="descricao"
                rows={3}
                value={formData.descricao}
                onChange={handleTextChange}
                className="flex-1 block w-full rounded-none rounded-r-lg border-gray-300 p-3"
                placeholder="Inclua modelo, voltagem, estado..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            <div>
              <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-gray-50 text-gray-500">
                  <Hash className="w-5 h-5" />
                </span>
                <input
                  type="number"
                  name="quantidade"
                  id="quantidade"
                  min="1"
                  value={formData.quantidade}
                  onChange={handleNumberChange}
                  required
                  className="flex-1 block w-full rounded-none rounded-r-lg border-gray-300 p-3"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dataAquisicao" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Aquisição
              </label>
              <div className="mt-1 flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-gray-50 text-gray-500">
                  <Calendar className="w-5 h-5" />
                </span>
                <input
                  type="date"
                  name="dataAquisicao"
                  id="dataAquisicao"
                  value={formData.dataAquisicao}
                  onChange={handleDateChange}
                  className="flex-1 block w-full rounded-none rounded-r-lg border-gray-300 p-3"
                />
              </div>
            </div>

          </div>
          <div>
            <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-1">
              Foto da Ferramenta
            </label>
            <div className="mt-1 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gray-50 text-gray-500 border border-gray-300 flex-shrink-0">
                {/* Ícone de Câmera da biblioteca Lucide React */}
                <Camera className="w-6 h-6" />
              </span>
              <div className="flex-1">
                <input
                  type="file"
                  name="imagem"
                  id="imagem"
                  accept="image/*"
                  onChange={() => console.log('test')}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
            {imagem && (
              <p className="mt-2 text-sm text-gray-500">
                Arquivo selecionado: <span className="font-semibold text-indigo-600">{imagem.name}</span>
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-semibold shadow-lg transition ${
              isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Cadastrando...' : 'Salvar Ferramenta'}
          </button>

        </form>
      </div>
    </div>
  );
};

