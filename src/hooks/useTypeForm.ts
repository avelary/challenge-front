import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const typeFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  description: z.string().optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  status: z.string().min(1, 'Status é obrigatório'),
  color: z.string().optional(),
})

export type TypeFormData = z.infer<typeof typeFormSchema>

interface TypeItem {
  id: number
  name: string
  description?: string
  category: string
  status: string
  color?: string
  createdAt: string
}

export function useTypeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [types, setTypes] = useState<TypeItem[]>([])

  const form = useForm<TypeFormData>({
    resolver: zodResolver(typeFormSchema),
    defaultValues: {
      status: 'active',
      name: '',
      description: '',
      category: '',
      color: '#3B82F6',
    },
  })

  const onSubmit = async (data: TypeFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Simular API call - você pode adaptar para sua API real
      const newType: TypeItem = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
      }

      setTypes(prev => [...prev, newType])
      setSubmitSuccess(true)
      form.reset({
        status: 'active',
        name: '',
        description: '',
        category: '',
        color: '#3B82F6',
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao cadastrar tipo'
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteType = (id: number) => {
    setTypes(prev => prev.filter(type => type.id !== id))
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    submitError,
    submitSuccess,
    resetSuccess: () => setSubmitSuccess(false),
    types,
    deleteType,
  }
}
