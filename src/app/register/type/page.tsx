'use client'

import { useTypeForm } from '@/hooks/useTypeForm'
import { FormInput } from '@/components/ui/form-input'
import { FormSelect } from '@/components/ui/form-select'
import { CheckCircle, AlertCircle, Loader2, Trash2, Tag } from 'lucide-react'

const categoryOptions = [
  { value: 'jewelry', label: 'Joias' },
  { value: 'accessory', label: 'Acessórios' },
  { value: 'watch', label: 'Relógios' },
  { value: 'custom', label: 'Personalizado' },
  { value: 'material', label: 'Material' },
  { value: 'finish', label: 'Acabamento' },
]

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
]

export default function RegisterTypePage() {
  const {
    form,
    onSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
    resetSuccess,
    types,
    deleteType,
  } = useTypeForm()

  const {
    register,
    formState: { errors },
    watch,
  } = form
  const selectedColor = watch('color')

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Cadastrar Tipo</h2>
              <p className="text-gray-300 mt-1">
                Crie novos tipos e categorias para classificar produtos
              </p>
            </div>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-md">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-300">
                      Tipo cadastrado com sucesso!
                    </h3>
                    <button
                      onClick={resetSuccess}
                      className="mt-2 text-sm text-green-400 hover:text-green-300"
                    >
                      Cadastrar outro tipo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-300">
                      Erro ao cadastrar tipo
                    </h3>
                    <p className="text-sm text-red-400 mt-1">{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <FormInput
                  label="Nome do Tipo"
                  name="name"
                  register={register}
                  error={errors.name}
                  required
                  placeholder="Ex: Ouro 18k, Prata 925, etc."
                />

                <FormSelect
                  label="Categoria"
                  name="category"
                  register={register}
                  error={errors.category}
                  options={categoryOptions}
                  placeholder="Selecione uma categoria"
                  required
                />

                <FormSelect
                  label="Status"
                  name="status"
                  register={register}
                  error={errors.status}
                  options={statusOptions}
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 block">
                    Cor de Identificação
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      {...register('color')}
                      className="h-10 w-16 border border-gray-600 rounded-md cursor-pointer bg-gray-700"
                    />
                    <div
                      className="h-10 w-20 rounded-md border border-gray-600"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <span className="text-sm text-gray-400">
                      {selectedColor}
                    </span>
                  </div>
                  {errors.color && (
                    <p className="text-sm text-red-400">
                      {errors.color.message}
                    </p>
                  )}
                </div>

                <FormInput
                  label="Descrição (Opcional)"
                  name="description"
                  register={register}
                  error={errors.description}
                  placeholder="Descrição detalhada do tipo"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => form.reset()}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  disabled={isSubmitting}
                >
                  Limpar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar Tipo'}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Tipos */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white">
                Tipos Cadastrados
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {types.length}{' '}
                {types.length === 1 ? 'tipo cadastrado' : 'tipos cadastrados'}
              </p>
            </div>

            {types.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum tipo cadastrado ainda</p>
                <p className="text-sm text-gray-500 mt-1">
                  Use o formulário ao lado para criar seu primeiro tipo
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {types.map(type => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-3 border border-gray-600 rounded-lg hover:bg-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-500"
                        style={{ backgroundColor: type.color }}
                      />
                      <div>
                        <h4 className="font-medium text-white">{type.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span>
                            {
                              categoryOptions.find(
                                c => c.value === type.category
                              )?.label
                            }
                          </span>
                          <span>•</span>
                          <span
                            className={
                              type.status === 'active'
                                ? 'text-green-400'
                                : 'text-red-400'
                            }
                          >
                            {
                              statusOptions.find(s => s.value === type.status)
                                ?.label
                            }
                          </span>
                        </div>
                        {type.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {type.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteType(type.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                      title="Excluir tipo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
