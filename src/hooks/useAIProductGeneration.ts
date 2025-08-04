import { useState } from 'react'
import { api } from '@/services'

interface AIGeneratedProduct {
  idsku: string
  title: string
  productType: 'souvenir' | 'menu' | 'vestuario'
  idcl: number
  idca: number
  idPartner: number
  idPrinter: number | null
  measure: string
  quantity: number | null
  price: number
  offer: number
  description: string
  remove: string | null
  include: string | null
  datasheet: string | null
  status: 'Pendente' | 'Ativo' | 'Inativo'
  image: string | null
  analysisMethod?: string
}

// 🍽️ NOVA: Interface para resposta de OCR de cardápio
interface MenuOCRResponse {
  success: boolean
  products: AIGeneratedProduct[]
  summary: {
    totalProductsFound: number
    totalProductsSaved: number
    ocrMethod: string
    ocrConfidence: number
    extractedText?: string
  }
  performance: {
    imageOptimizationMs: number
    ocrProcessingMs: number
    bulkSaveMs: number
    totalTimeMs: number
  }
}

export function useAIProductGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [generatedProduct, setGeneratedProduct] =
    useState<AIGeneratedProduct | null>(null)

  // 🍽️ NOVA: Estado para OCR de cardápio
  const [menuOCRResult, setMenuOCRResult] = useState<MenuOCRResponse | null>(
    null
  )

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

  // 🍽️ NOVA: Função específica para OCR de cardápio
  const analyzeMenuImage = async (imageFile: File) => {
    if (isGenerating) {
      console.log('⚠️ Análise já em andamento, ignorando nova chamada')
      return
    }

    console.log('🍽️ Iniciando análise de CARDÁPIO')
    setIsGenerating(true)
    setGenerationError(null)
    setGeneratedProduct(null)
    setMenuOCRResult(null)

    try {
      const formData = new FormData()
      formData.append('images', imageFile) // Note: usa 'images' não 'image'

      console.log('📡 Usando endpoint: /products/bulk-menu-ocr (CARDÁPIO)')
      console.log(`📎 Arquivo: ${imageFile.name} (${imageFile.size} bytes)`)

      const response = await api.post('/products/bulk-menu-ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('✅ Resposta recebida do endpoint de cardápio')
      console.log(
        `🎯 Produtos cadastrados: ${response.data.products?.length || 0}`
      )

      setMenuOCRResult(response.data)
      return response.data
    } catch (error: unknown) {
      console.error('❌ Erro na análise de cardápio:', error)
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao analisar cardápio com IA'
      console.error('❌ Mensagem de erro:', errorMessage)
      setGenerationError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      console.log('🔄 Finalizando análise de cardápio')
      setIsGenerating(false)
    }
  }

  const clearGeneration = () => {
    setGeneratedProduct(null)
    setGenerationError(null)
    setMenuOCRResult(null) // 🍽️ NOVA: Limpar resultado do cardápio
  }

  return {
    analyzeProductImage,
    analyzeMenuImage, // 🍽️ NOVA: Função para cardápio
    isGenerating,
    generationError,
    generatedProduct,
    menuOCRResult, // 🍽️ NOVA: Resultado do cardápio
    clearGeneration,
  }
}
