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
}

export function useAIProductGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [generatedProduct, setGeneratedProduct] =
    useState<AIGeneratedProduct | null>(null)

  const analyzeProductImage = async (imageFile: File) => {
    setIsGenerating(true)
    setGenerationError(null)
    setGeneratedProduct(null)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await api.post('/products/generate-ai', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setGeneratedProduct(response.data)
      return response.data
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao analisar imagem com IA'
      setGenerationError(errorMessage)
      throw new Error(errorMessage)
    } finally {
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
