import React from 'react'
import {
  CheckCircle,
  Bot,
  Calendar,
  Tag,
  DollarSign,
  Eye,
  Clock,
  AlertTriangle,
  Images,
  Image as ImageIcon,
} from 'lucide-react'

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
  aiAnalyzed?: boolean
  analysisMethod?: string
  rateLimitHit?: boolean
  originalClassification: string
  originalCategory: string
  totalImagesProcessed?: number
  imagesUsedForAnalysis?: number
}

interface AIGeneratedProductProps {
  product: AIGeneratedProduct
  onClose: () => void
  onAnalyzeAnother: () => void
}

export function AIGeneratedProduct({
  product,
  onClose,
  onAnalyzeAnother,
}: AIGeneratedProductProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      souvenir: 'Souvenir',
      menu: 'Menu',
      vestuario: 'Vestuário',
    }
    return typeLabels[type] || type
  }

  const getAnalysisMethodInfo = () => {
    switch (product.analysisMethod) {
      case 'ai-vision':
        return {
          icon: <Eye className="h-4 w-4 text-purple-400" />,
          title: 'Análise Visual com IA',
          description:
            'Produto identificado através da análise visual da imagem com OpenAI Vision.',
          color: 'purple',
        }
      case 'ai-vision-multiple':
        return {
          icon: <Images className="h-4 w-4 text-purple-400" />,
          title: 'Análise Visual Múltipla com IA',
          description:
            'Produto identificado através da análise de múltiplas imagens com OpenAI Vision para maior precisão.',
          color: 'purple',
        }
      case 'ai-vision-single-fallback':
        return {
          icon: <ImageIcon className="h-4 w-4 text-blue-400" />,
          title: 'Análise Visual (Fallback)',
          description:
            'Produto identificado com análise de uma imagem após falha na análise múltipla.',
          color: 'blue',
        }
      case 'smart-fallback':
        return {
          icon: <Bot className="h-4 w-4 text-blue-400" />,
          title: 'Análise Inteligente',
          description:
            'Produto criado com base no nome do arquivo e padrões inteligentes.',
          color: 'blue',
        }
      case 'simple-fallback':
        return {
          icon: <Clock className="h-4 w-4 text-yellow-400" />,
          title: 'Produto Padrão',
          description:
            'Produto criado com configurações padrão devido a limitações temporárias.',
          color: 'yellow',
        }
      default:
        return {
          icon: <Bot className="h-4 w-4 text-gray-400" />,
          title: 'Produto Gerado',
          description: 'Produto criado automaticamente.',
          color: 'gray',
        }
    }
  }

  const analysisInfo = getAnalysisMethodInfo()

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {analysisInfo.icon}
          <h3 className="text-lg font-semibold text-white">
            {analysisInfo.title}
          </h3>
          <CheckCircle className="h-5 w-5 text-green-400" />
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(product.createdAt)}</span>
        </div>
      </div>

      {/* Multiple Images Info */}
      {product.totalImagesProcessed && product.totalImagesProcessed > 1 && (
        <div className="mb-4 p-3 bg-purple-900/20 border border-purple-700/50 rounded-md">
          <div className="flex items-center space-x-2">
            <Images className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">
              Análise com Múltiplas Imagens
            </span>
          </div>
          <p className="text-xs text-purple-200 mt-1">
            {product.totalImagesProcessed} imagens processadas.
            {product.imagesUsedForAnalysis && product.imagesUsedForAnalysis > 1
              ? ` ${product.imagesUsedForAnalysis} imagens foram analisadas em conjunto pela IA para gerar uma descrição mais precisa.`
              : ` A primeira imagem foi utilizada para análise devido a limitações técnicas.`}
          </p>
        </div>
      )}

      {/* Rate Limit Warning */}
      {product.rateLimitHit && (
        <div className="mb-4 p-3 bg-amber-900/20 border border-amber-700/50 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">
              Limite Temporário Atingido
            </span>
          </div>
          <p className="text-xs text-amber-200 mt-1">
            O produto foi criado com método alternativo devido ao limite de
            requisições da OpenAI. Aguarde alguns minutos para usar a análise
            visual completa.
          </p>
        </div>
      )}

      {/* Analysis Method Info */}
      <div
        className={`mb-4 p-3 bg-${analysisInfo.color}-900/20 border border-${analysisInfo.color}-700/50 rounded-md`}
      >
        <div className="flex items-center space-x-2">
          {analysisInfo.icon}
          <span
            className={`text-sm text-${analysisInfo.color}-300 font-medium`}
          >
            {analysisInfo.title}
          </span>
        </div>
        <p className={`text-xs text-${analysisInfo.color}-200 mt-1`}>
          {analysisInfo.description}
        </p>
      </div>

      <div className="space-y-4">
        {/* Título e SKU */}
        <div>
          <h4 className="text-xl font-bold text-white mb-1">{product.title}</h4>
          <p className="text-sm text-gray-400">SKU: {product.idsku}</p>
        </div>

        {/* Informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-md p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Tag className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium text-gray-300">TIPO</span>
            </div>
            <p className="text-sm text-white font-medium">
              {getTypeLabel(product.productType)}
            </p>
          </div>

          <div className="bg-gray-700/50 rounded-md p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Tag className="h-4 w-4 text-green-400" />
              <span className="text-xs font-medium text-gray-300">
                CLASSIFICAÇÃO
              </span>
            </div>
            <p className="text-sm text-white font-medium capitalize">
              {product.originalClassification.replace('_', ' ')}
            </p>
          </div>

          <div className="bg-gray-700/50 rounded-md p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Tag className="h-4 w-4 text-yellow-400" />
              <span className="text-xs font-medium text-gray-300">
                CATEGORIA
              </span>
            </div>
            <p className="text-sm text-white font-medium capitalize">
              {product.originalCategory.replace('_', ' ')}
            </p>
          </div>

          <div className="bg-gray-700/50 rounded-md p-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-gray-300">STATUS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <p className="text-sm text-white font-medium capitalize">
                {product.status === 'pending' ? 'Pendente' : product.status}
              </p>
            </div>
          </div>
        </div>

        {/* Preços */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-900/20 border border-green-700/50 rounded-md p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-green-300">PREÇO</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-md p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">OFERTA</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {formatPrice(product.offer)}
            </p>
            <p className="text-xs text-blue-300 mt-1">
              Desconto de {formatPrice(product.price - product.offer)}
            </p>
          </div>
        </div>

        {/* Descrição */}
        {product.description && (
          <div className="bg-gray-700/30 rounded-md p-4">
            <h5 className="text-sm font-medium text-gray-300 mb-2">
              DESCRIÇÃO
            </h5>
            <p className="text-sm text-gray-200 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={onAnalyzeAnother}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
          >
            <Images className="h-4 w-4" />
            <span>Analisar Outras Imagens</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
