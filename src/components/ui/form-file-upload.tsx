import React, { useState } from 'react'
import { UseFormRegister, FieldError } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface FormFileUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  register?: UseFormRegister<any>
  name: string
  onFileSelect?: (file: File | null) => void
}

export const FormFileUpload = React.forwardRef<
  HTMLInputElement,
  FormFileUploadProps
>(
  (
    { label, error, register, name, onFileSelect, className, ...props },
    ref
  ) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const registration = register ? register(name) : {}

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null
      setSelectedFile(file)

      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }

      onFileSelect?.(file)
    }

    const clearFile = () => {
      setSelectedFile(null)
      setPreview(null)
      onFileSelect?.(null)
      if (ref && 'current' in ref && ref.current) {
        ref.current.value = ''
      }
    }

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200 block">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>

        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Upload Area */}
          <div className="flex-1">
            <div className="relative">
              <input
                ref={ref}
                {...registration}
                {...props}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={cn(
                  'border-2 border-dashed border-gray-600 rounded-md p-4 sm:p-6 text-center hover:border-gray-500 transition-colors',
                  error && 'border-red-500',
                  className
                )}
              >
                <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
                <p className="text-xs sm:text-sm text-gray-400 mb-1">
                  {selectedFile
                    ? selectedFile.name
                    : 'Clique para selecionar uma imagem'}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG até 10MB</p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex justify-center sm:justify-start">
            {preview ? (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 border border-gray-600 rounded-md overflow-hidden bg-gray-700">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors z-20"
                >
                  <X className="w-2 h-2 sm:w-3 sm:h-3" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 border border-gray-600 rounded-md flex items-center justify-center bg-gray-700">
                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error.message}</p>}
      </div>
    )
  }
)

FormFileUpload.displayName = 'FormFileUpload'
