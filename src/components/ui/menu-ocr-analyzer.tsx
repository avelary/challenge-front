'use client'

import { useState, useRef } from 'react'
import { useAIProductGeneration } from '@/hooks/useAIProductGeneration'

interface MenuOCRAnalyzerProps {
  onMenuAnalyzeComplete?: (result: any) => void
}

export function MenuOCRAnalyzer({
  onMenuAnalyzeComplete,
}: MenuOCRAnalyzerProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    analyzeMenuImage,
    isGenerating,
    generationError,
    menuOCRResult,
    clearGeneration,
  } = useAIProductGeneration()

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return

    const file = files[0] // Apenas 1 imagem para cardápio
    setSelectedImage(file)

    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFileSelect(Array.from(files))
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    try {
      console.log('🍽️ Iniciando análise de cardápio...')
      const result = await analyzeMenuImage(selectedImage)

      if (result && result.products?.length > 0) {
        setShowResult(true)
        onMenuAnalyzeComplete?.(result)
        console.log(
          `✅ Cardápio analisado: ${result.products.length} produtos cadastrados`
        )
      }
    } catch (error) {
      console.error('❌ Erro ao analisar cardápio:', error)
    }
  }

  const clearAll = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setShowResult(false)
    clearGeneration()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-900 rounded-lg border border-gray-700">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          🍽️ Análise de Cardápio com IA
        </h3>
        <p className="text-gray-400 text-sm">
          Envie uma foto do cardápio para cadastrar múltiplos produtos
          automaticamente
        </p>
      </div>

      {/* Upload de Imagem */}
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className="hidden"
          />

          {!selectedImage ? (
            <div>
              <div className="text-4xl mb-2">📸</div>
              <p className="text-gray-400 mb-2">
                Clique para selecionar imagem do cardápio
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Escolher Imagem
              </button>
            </div>
          ) : (
            <div>
              <p className="text-green-400 mb-2">
                ✅ Imagem selecionada: {selectedImage.name}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
              >
                Trocar Imagem
              </button>
            </div>
          )}
        </div>

        {/* Preview da Imagem */}
        {imagePreview && (
          <div className="text-center">
            <img
              src={imagePreview}
              alt="Preview do cardápio"
              className="max-w-full max-h-64 mx-auto rounded-lg border border-gray-600"
            />
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3 justify-center">
        {selectedImage && (
          <>
            <button
              onClick={handleAnalyze}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Analisando Cardápio...
                </>
              ) : (
                <>🔍 Analisar Cardápio</>
              )}
            </button>

            <button
              onClick={clearAll}
              disabled={isGenerating}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors"
            >
              Limpar
            </button>
          </>
        )}
      </div>

      {/* Erro */}
      {generationError && (
        <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-md">
          <p className="font-medium">❌ Erro na análise:</p>
          <p className="text-sm">{generationError}</p>
        </div>
      )}

      {/* Resultado */}
      {showResult && menuOCRResult && (
        <div className="bg-green-900 border border-green-700 text-green-200 p-4 rounded-md space-y-3">
          <div className="font-medium">✅ Cardápio analisado com sucesso!</div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-400">Produtos encontrados:</span>{' '}
              {menuOCRResult.summary.totalProductsFound}
            </div>
            <div>
              <span className="text-green-400">Produtos salvos:</span>{' '}
              {menuOCRResult.summary.totalProductsSaved}
            </div>
            <div>
              <span className="text-green-400">Método:</span>{' '}
              {menuOCRResult.summary.ocrMethod}
            </div>
            <div>
              <span className="text-green-400">Tempo:</span>{' '}
              {menuOCRResult.performance.totalTimeMs}ms
            </div>
          </div>

          {menuOCRResult.products && menuOCRResult.products.length > 0 && (
            <div>
              <p className="text-green-400 font-medium mb-2">
                Produtos cadastrados:
              </p>
              <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                {menuOCRResult.products.map((product, index) => (
                  <li key={product.idsku} className="flex justify-between">
                    <span>
                      {index + 1}. {product.title}
                    </span>
                    <span className="text-green-300">
                      R$ {Number(product.price).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-green-400">
            💡 Os produtos foram cadastrados automaticamente na lista principal.
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="bg-blue-900 border border-blue-700 text-blue-200 p-4 rounded-md text-sm">
        <p className="font-medium mb-2">📋 Como usar:</p>
        <ul className="space-y-1 text-xs">
          <li>• Tire uma foto clara do cardápio</li>
          <li>• Certifique-se que os produtos e preços estão visíveis</li>
          <li>
            • A IA irá extrair automaticamente todos os produtos do cardápio
          </li>
          <li>
            • Os produtos serão cadastrados com a mesma imagem do cardápio
          </li>
        </ul>
      </div>
    </div>
  )
}
