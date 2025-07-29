import React, { useState, useRef } from 'react'
import { Upload, ImageIcon, X, Loader2, Plus, Trash2 } from 'lucide-react'

interface AIImageAnalyzerProps {
  onImageAnalyze: (imageFiles: File[]) => Promise<void>
  isAnalyzing: boolean
}

export function AIImageAnalyzer({
  onImageAnalyze,
  isAnalyzing,
}: AIImageAnalyzerProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
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

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleFileSelect = (files: File[]) => {
    // Filtrar apenas imagens
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      alert('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Verificar limite máximo (3 imagens)
    const newImages = [...selectedImages, ...imageFiles]
    if (newImages.length > 3) {
      alert('Máximo de 3 imagens permitidas')
      return
    }

    // Verificar tamanho máximo por arquivo (10MB)
    const oversizedFiles = imageFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    )
    if (oversizedFiles.length > 0) {
      alert('Algumas imagens são muito grandes. Máximo 10MB por imagem.')
      return
    }

    setSelectedImages(newImages)

    // Criar previews para as novas imagens
    const newPreviews = [...imagePreviews]
    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string)
        setImagePreviews([...newPreviews])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFileSelect(Array.from(files))
    }
  }

  const handleAnalyze = async () => {
    if (selectedImages.length === 0) return

    try {
      await onImageAnalyze(selectedImages)
    } catch (error) {
      console.error('Erro ao analisar imagens:', error)
    }
  }

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setSelectedImages(newImages)
    setImagePreviews(newPreviews)
  }

  const clearAllImages = () => {
    setSelectedImages([])
    setImagePreviews([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addMoreImages = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {selectedImages.length === 0 ? (
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
            multiple
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Envie imagens do produto para análise da IA
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              Arraste e solte imagens aqui, ou clique para selecionar
            </p>
            <p className="text-xs text-gray-500 mb-2">
              Formatos suportados: JPG, PNG, WEBP (máx. 10MB por imagem)
            </p>
            <p className="text-xs text-purple-400 font-medium">
              📸 Envie até 3 imagens para análise completa
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header com contador e botões */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-white">
                {selectedImages.length} imagem
                {selectedImages.length > 1 ? 's' : ''} selecionada
                {selectedImages.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex space-x-2">
              {selectedImages.length < 5 && (
                <button
                  onClick={addMoreImages}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md transition-colors"
                  disabled={isAnalyzing}
                >
                  <Plus className="h-3 w-3" />
                  <span>Adicionar</span>
                </button>
              )}
              <button
                onClick={clearAllImages}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-md transition-colors"
                disabled={isAnalyzing}
              >
                <Trash2 className="h-3 w-3" />
                <span>Limpar</span>
              </button>
            </div>
          </div>

          {/* Input para adicionar mais imagens */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Grid de previews das imagens */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="bg-gray-800 rounded-lg p-2">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="mt-2 text-xs text-gray-400 truncate">
                    {selectedImages[index]?.name}
                  </div>
                </div>

                {/* Botão de remover */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isAnalyzing}
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Número da imagem */}
                <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Dica sobre múltiplas imagens */}
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              💡 <strong>Dica:</strong> Envie diferentes ângulos do mesmo
              produto para uma análise mais precisa! A IA analisará todas as
              imagens juntas para gerar uma descrição mais completa.
            </p>
          </div>

          {/* Botão de análise */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || selectedImages.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>
                  Analisando {selectedImages.length} imagem
                  {selectedImages.length > 1 ? 's' : ''}...
                </span>
              </>
            ) : (
              <>
                <ImageIcon className="h-5 w-5" />
                <span>
                  Analisar {selectedImages.length} imagem
                  {selectedImages.length > 1 ? 's' : ''} com IA
                </span>
              </>
            )}
          </button>

          {isAnalyzing && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Processando suas imagens...
                  </p>
                  <p className="text-xs text-gray-400">
                    A IA está analisando {selectedImages.length} imagem
                    {selectedImages.length > 1 ? 's' : ''} para gerar o produto
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
