import React, { useState, useRef } from 'react'
import { Upload, Bot, Image as ImageIcon, X, Loader2 } from 'lucide-react'

interface AIImageAnalyzerProps {
  onImageAnalyze: (file: File) => Promise<void>
  isAnalyzing: boolean
}

export function AIImageAnalyzer({
  onImageAnalyze,
  isAnalyzing,
}: AIImageAnalyzerProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem')
      return
    }

    setSelectedImage(file)

    // Criar preview da imagem
    const reader = new FileReader()
    reader.onload = e => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    try {
      await onImageAnalyze(selectedImage)
    } catch (error) {
      console.error('Erro ao analisar imagem:', error)
    }
  }

  const clearSelection = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? 'border-purple-400 bg-purple-900/20'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Envie uma imagem do produto
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Arraste e solte uma imagem aqui, ou clique para selecionar
            </p>
            <p className="text-xs text-gray-500">
              Formatos suportados: JPG, PNG, WEBP (máx. 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview da imagem */}
          <div className="relative">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">
                    Imagem Selecionada
                  </span>
                </div>
                <button
                  onClick={clearSelection}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={isAnalyzing}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative">
                <img
                  src={imagePreview!}
                  alt="Preview do produto"
                  className="w-full h-48 object-cover rounded-md"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-white">Analisando imagem...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 text-xs text-gray-400">
                <p>Nome: {selectedImage.name}</p>
                <p>
                  Tamanho: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>

          {/* Botão de análise */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analisando com IA...</span>
              </>
            ) : (
              <>
                <Bot className="w-5 h-5" />
                <span>Analisar Produto com IA</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
