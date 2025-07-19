'use client'

import { useProductForm } from '@/hooks/useProductForm'
import { useAIProductGeneration } from '@/hooks/useAIProductGeneration'
import { FormInput } from '@/components/ui/form-input'
import { FormSelect } from '@/components/ui/form-select'
import { FormFileUpload } from '@/components/ui/form-file-upload'
import { AIGeneratedProduct } from '@/components/ui/ai-generated-product'
import { AIImageAnalyzer } from '@/components/ui/ai-image-analyzer'
import {
  productTypes,
  getClassificationsByType,
  getCategoriesByClassification,
  partners,
  printers,
  measureUnits,
  statusOptions,
} from '@/constants/product-options'
import { CheckCircle, AlertCircle, Loader2, Eye, Sparkles } from 'lucide-react'
import { useEffect } from 'react'

export default function RegisterProductPage() {
  const {
    form,
    onSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
    resetSuccess,
    handleImageSelect,
  } = useProductForm()

  const {
    analyzeProductImage,
    isGenerating,
    generationError,
    generatedProduct,
    clearGeneration,
  } = useAIProductGeneration()

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form

  // Assistir mudanças nos selects
  const watchedType = watch('productType')
  const watchedClassification = watch('classification')

  // Resetar classificação quando tipo mudar
  useEffect(() => {
    if (watchedType) {
      setValue('classification', '')
      setValue('category', '')
    }
  }, [watchedType, setValue])

  // Resetar categoria quando classificação mudar
  useEffect(() => {
    if (watchedClassification) {
      setValue('category', '')
    }
  }, [watchedClassification, setValue])

  // Obter opções dependentes
  const availableClassifications = watchedType
    ? getClassificationsByType(watchedType)
    : []
  const availableCategories = watchedClassification
    ? getCategoriesByClassification(watchedClassification)
    : []

  const handleImageAnalysis = async (imageFile: File) => {
    try {
      await analyzeProductImage(imageFile)
    } catch (error) {
      console.log(error)
      // Erro já está sendo tratado no hook
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Seção de IA - Análise de Imagem */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-700/50 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-purple-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Análise Automática com IA
              </h2>
              <Sparkles className="h-5 w-5 text-yellow-400" />
            </div>
          </div>

          {!generatedProduct && (
            <div>
              <p className="text-gray-300 mb-4 text-sm sm:text-base text-center">
                Envie uma imagem do produto e deixe a IA analisar e preencher os
                dados automaticamente
              </p>
              <AIImageAnalyzer
                onImageAnalyze={handleImageAnalysis}
                isAnalyzing={isGenerating}
              />
            </div>
          )}

          {generationError && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">
                    Erro na análise automática
                  </h3>
                  <p className="text-sm text-red-400 mt-1">{generationError}</p>
                  <button
                    onClick={clearGeneration}
                    className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            </div>
          )}

          {generatedProduct && (
            <AIGeneratedProduct
              product={generatedProduct}
              onClose={clearGeneration}
              onAnalyzeAnother={clearGeneration}
            />
          )}
        </div>

        {/* Formulário Manual */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Cadastro Manual de Produto
            </h2>
            <p className="text-gray-300 mt-1 text-sm sm:text-base">
              Ou preencha os dados manualmente para cadastrar um novo produto
            </p>
          </div>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-md">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-300">
                    Produto cadastrado com sucesso!
                  </h3>
                  <button
                    onClick={resetSuccess}
                    className="mt-2 text-sm text-green-400 hover:text-green-300"
                  >
                    Cadastrar outro produto
                  </button>
                </div>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">
                    Erro ao cadastrar produto
                  </h3>
                  <p className="text-sm text-red-400 mt-1 break-words">
                    {submitError}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-2">
                  <FormInput
                    label="Título do Produto"
                    name="title"
                    register={register}
                    error={errors.title}
                    required
                    placeholder="Ex: Camiseta Souvenir Local"
                  />
                </div>

                <FormSelect
                  label="Tipo do Produto"
                  name="productType"
                  register={register}
                  error={errors.productType}
                  options={productTypes}
                  placeholder="Selecione o tipo"
                  required
                />

                <FormSelect
                  label="Status"
                  name="status"
                  register={register}
                  error={errors.status}
                  options={statusOptions}
                  required
                />
              </div>
            </div>

            {/* Classificação Dependente */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                Classificação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <FormSelect
                  label="Classificação"
                  name="classification"
                  register={register}
                  error={errors.classification}
                  options={availableClassifications}
                  placeholder={
                    watchedType
                      ? 'Selecione a classificação'
                      : 'Primeiro selecione o tipo'
                  }
                  required
                  disabled={!watchedType}
                />

                <FormSelect
                  label="Categoria"
                  name="category"
                  register={register}
                  error={errors.category}
                  options={availableCategories}
                  placeholder={
                    watchedClassification
                      ? 'Selecione a categoria'
                      : 'Primeiro selecione a classificação'
                  }
                  required
                  disabled={!watchedClassification}
                />

                <FormSelect
                  label="Parceiro"
                  name="idPartner"
                  register={register}
                  error={errors.idPartner}
                  options={partners}
                  placeholder="Selecione o parceiro"
                  required
                  className="md:col-span-2 xl:col-span-1"
                />
              </div>

              {/* Indicadores visuais */}
              {watchedType && (
                <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700/50 rounded-md">
                  <p className="text-sm text-blue-300">
                    <span className="font-medium">Tipo selecionado:</span>{' '}
                    {productTypes.find(t => t.value === watchedType)?.label}
                    {availableClassifications.length > 0 && (
                      <span className="ml-2 text-blue-400">
                        ({availableClassifications.length} classificações
                        disponíveis)
                      </span>
                    )}
                  </p>
                </div>
              )}

              {watchedClassification && (
                <div className="mt-3 p-3 bg-green-900/20 border border-green-700/50 rounded-md">
                  <p className="text-sm text-green-300">
                    <span className="font-medium">
                      Classificação selecionada:
                    </span>{' '}
                    {
                      availableClassifications.find(
                        c => c.value === watchedClassification
                      )?.label
                    }
                    {availableCategories.length > 0 && (
                      <span className="ml-2 text-green-400">
                        ({availableCategories.length} categorias disponíveis)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Especificações */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                Especificações
              </h3>

              {/* Grid de 4 colunas para especificações numéricas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <FormInput
                  label="Quantidade"
                  name="quantity"
                  register={register}
                  error={errors.quantity}
                  type="number"
                  step="0.001"
                  placeholder="10.000"
                />

                <FormSelect
                  label="Unidade de Medida"
                  name="measure"
                  register={register}
                  error={errors.measure}
                  options={measureUnits}
                  placeholder="Selecione"
                  required
                />

                <FormInput
                  label="Preço"
                  name="price"
                  register={register}
                  error={errors.price}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="99.99"
                  required
                />

                <FormInput
                  label="Oferta"
                  name="offer"
                  register={register}
                  error={errors.offer}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="89.99"
                  required
                />
              </div>

              {/* Seção separada para impressora e upload de imagem */}
              <div className="space-y-4">
                <FormSelect
                  label="Impressora (Opcional)"
                  name="idPrinter"
                  register={register}
                  error={errors.idPrinter}
                  options={printers}
                  placeholder="Selecione uma impressora"
                />

                <FormFileUpload
                  label="Imagem do Produto"
                  name="image"
                  onFileSelect={handleImageSelect}
                  accept="image/*"
                />
              </div>
            </div>

            {/* Descrições */}
            <div className="pb-6">
              <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                Descrições
              </h3>
              <div className="space-y-4">
                <FormInput
                  label="Descrição"
                  name="description"
                  register={register}
                  error={errors.description}
                  placeholder="Descrição detalhada do produto"
                />

                <FormInput
                  label="Itens Removidos"
                  name="remove"
                  register={register}
                  error={errors.remove}
                  placeholder="Itens que foram removidos"
                />

                <FormInput
                  label="Itens Inclusos"
                  name="include"
                  register={register}
                  error={errors.include}
                  placeholder="Itens inclusos no produto"
                />

                <FormInput
                  label="Ficha Técnica"
                  name="datasheet"
                  register={register}
                  error={errors.datasheet}
                  placeholder="Informações técnicas do produto"
                />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => form.reset()}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                disabled={isSubmitting}
              >
                Limpar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
