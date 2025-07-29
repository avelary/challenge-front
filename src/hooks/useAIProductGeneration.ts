import { useState } from 'react'
import { api } from '@/services'

interface AIGeneratedProduct {
  idsku: number
  title: string
  productType: string
  price: number
  offer: number
  description: string
  status: string
  createdAt: string
  aiGenerated: boolean
  aiAnalyzed: boolean
  originalClassification: string
  originalCategory: string
  totalImagesProcessed?: number
  imagesUsedForAnalysis?: number
  analysisMethod?: string
}

export function useAIProductGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [generatedProduct, setGeneratedProduct] =
    useState<AIGeneratedProduct | null>(null)

  const analyzeProductImage = async (imageFiles: File[]) => {
    // Prevenir chamadas duplicadas
    if (isGenerating) {
      console.log('⚠️ Análise já em andamento, ignorando nova chamada')
      return
    }

    console.log(`🚀 Iniciando análise de ${imageFiles.length} imagem(ns)`)
    setIsGenerating(true)
    setGenerationError(null)
    setGeneratedProduct(null)

    try {
      const formData = new FormData()

      // Verificar se é uma única imagem ou múltiplas
      if (imageFiles.length === 1) {
        // Usar endpoint original para uma imagem
        console.log('📡 Usando endpoint: /products/generate-ai (imagem única)')
        formData.append('image', imageFiles[0])

        const response = await api.post('/products/generate-ai', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        console.log('✅ Resposta recebida do endpoint de imagem única')
        setGeneratedProduct(response.data)
        return response.data
      } else {
        // Usar novo endpoint para múltiplas imagens
        console.log(
          `📡 Usando endpoint: /products/generate-ai-multiple (${imageFiles.length} imagens)`
        )
        imageFiles.forEach((file, index) => {
          console.log(
            `📎 Adicionando arquivo ${index + 1}: ${file.name} (${
              file.size
            } bytes)`
          )
          formData.append('images', file)
        })

        const response = await api.post(
          '/products/generate-ai-multiple',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        console.log('✅ Resposta recebida do endpoint de múltiplas imagens')
        setGeneratedProduct(response.data)
        return response.data
      }
    } catch (error: unknown) {
      console.error('❌ Erro na análise de imagem:', error)
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao analisar imagem com IA'
      console.error('❌ Mensagem de erro:', errorMessage)
      setGenerationError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      console.log('🔄 Finalizando análise, resetando isGenerating')
      setIsGenerating(false)
    }
  }

  const clearGeneration = () => {
    setGeneratedProduct(null)
    setGenerationError(null)
  }

  return {
    analyzeProductImage,
    isGenerating,
    generationError,
    generatedProduct,
    clearGeneration,
  }
}
