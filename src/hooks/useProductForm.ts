import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/services'
import { useState } from 'react'

const productFormSchema = z.object({
  title: z
    .string()
    .min(2, 'Título deve ter pelo menos 2 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  productType: z.string().min(1, 'Tipo do produto é obrigatório'),
  classification: z.string().min(1, 'Classificação é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  idPartner: z.string().min(1, 'Parceiro é obrigatório'),
  idPrinter: z.string().optional(),
  measure: z.string().max(3, 'Medida deve ter no máximo 3 caracteres'),
  quantity: z.string().optional(),
  price: z.string().min(1, 'Preço é obrigatório'),
  offer: z.string().min(1, 'Oferta é obrigatória'),
  description: z.string().optional(),
  remove: z.string().optional(),
  include: z.string().optional(),
  datasheet: z.string().optional(),
  status: z.string().default('pending'),
  image: z.unknown().optional(), // Para o arquivo de imagem
})

export type ProductFormData = z.infer<typeof productFormSchema>

export function useProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      status: 'pending',
      productType: '',
      classification: '',
      category: '',
      idPartner: '',
      idPrinter: '',
      measure: '',
      quantity: '',
      price: '',
      offer: '',
      title: '',
      description: '',
      remove: '',
      include: '',
      datasheet: '',
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      let imageUrl = null

      // Upload da imagem primeiro, se houver
      if (selectedImage) {
        const formData = new FormData()
        formData.append('image', selectedImage)

        const uploadResponse = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        imageUrl = uploadResponse.data.imageUrl
      }

      // Preparar payload - agora usando strings para classificação e categoria
      const payload = {
        title: data.title,
        productType: data.productType,
        // Usando hash simples para converter strings em IDs únicos
        idca: Math.abs(
          data.category.split('').reduce((a, b) => a + b.charCodeAt(0), 0) %
            1000
        ),
        idcl: Math.abs(
          data.classification
            .split('')
            .reduce((a, b) => a + b.charCodeAt(0), 0) % 1000
        ),
        idPartner: parseInt(data.idPartner),
        idPrinter: data.idPrinter ? parseInt(data.idPrinter) : null,
        measure: data.measure,
        quantity: data.quantity ? parseFloat(data.quantity) : null,
        price: parseFloat(data.price),
        offer: parseFloat(data.offer),
        description: data.description || null,
        remove: data.remove || null,
        include: data.include || null,
        datasheet: data.datasheet || null,
        status: data.status,
        image: imageUrl,
      }

      await api.post('/products', payload)

      setSubmitSuccess(true)
      setSelectedImage(null)
      form.reset()
    } catch (error: unknown) {
      setSubmitError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao cadastrar produto'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file)
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    submitError,
    submitSuccess,
    resetSuccess: () => setSubmitSuccess(false),
    selectedImage,
    handleImageSelect,
  }
}
