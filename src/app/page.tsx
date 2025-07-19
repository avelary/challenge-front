'use client'

import { ProductImage } from '@/components/ui/product-image'
import { api } from '@/services'
import { Package, Plus, Search, ChevronDown, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Product {
  idsku: number
  title: string
  productType: string
  price: number
  offer: number
  status: string
  image?: string
  createdAt: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    product: Product | null
    isDeleting: boolean
  }>({
    isOpen: false,
    product: null,
    isDeleting: false,
  })

  // Buscar produtos
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (err: unknown) {
      setError('Erro ao carregar produtos')
      console.error('Erro ao buscar produtos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Deletar produto
  const handleDeleteProduct = async (product: Product) => {
    setDeleteModal({ isOpen: true, product, isDeleting: false })
  }

  const confirmDelete = async () => {
    if (!deleteModal.product) return

    setDeleteModal(prev => ({ ...prev, isDeleting: true }))

    try {
      await api.delete(`/products/${deleteModal.product.idsku}`)

      // Remover produto da lista local
      setProducts(prev =>
        prev.filter(p => p.idsku !== deleteModal.product!.idsku)
      )

      // Fechar modal
      setDeleteModal({ isOpen: false, product: null, isDeleting: false })
    } catch (err: unknown) {
      console.error('Erro ao deletar produto:', err)
      alert('Erro ao deletar produto. Tente novamente.')
      setDeleteModal(prev => ({ ...prev, isDeleting: false }))
    }
  }

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, product: null, isDeleting: false })
  }

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || product.status === statusFilter
    const matchesType =
      typeFilter === 'all' || product.productType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      released: 'Liberado',
      inactive: 'Inativo',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      released: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      souvenir: 'Souvenir',
      menu: 'Menu',
      vestuario: 'Vestuário',
    }
    return typeMap[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando produtos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-md">
            <h3 className="text-red-300 font-medium mb-2">Erro ao carregar</h3>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <Package className="h-8 w-8 text-blue-400" />
                Dashboard
              </h1>
              <p className="text-gray-300 mt-1">
                Gerencie seus produtos de forma simples
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link
                href="/register/type"
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Tipo
              </Link>
              <Link
                href="/register/product"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="appearance-none bg-gray-700 border border-gray-600 rounded-md px-4 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os status</option>
                  <option value="pending">Pendente</option>
                  <option value="released">Liberado</option>
                  <option value="inactive">Inativo</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="appearance-none bg-gray-700 border border-gray-600 rounded-md px-4 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="souvenir">Souvenir</option>
                  <option value="menu">Menu</option>
                  <option value="vestuario">Vestuário</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Mostrando {filteredProducts.length} de {products.length} produtos
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 max-w-md mx-auto">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando seu primeiro produto'}
              </p>
              <Link
                href="/register/product"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Produto
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.idsku}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 group"
              >
                <div className="relative aspect-w-3 aspect-h-2 w-full overflow-hidden rounded-t-lg">
                  <ProductImage
                    src={product.image || null}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="h-40 sm:h-48 w-full object-cover group-hover:opacity-75 transition-opacity"
                  />

                  {/* Delete button - aparece no hover */}
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    title="Deletar produto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-white line-clamp-2 flex-1 mr-2">
                      {product.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {getStatusLabel(product.status)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mb-3">
                    {getTypeLabel(product.productType)} • SKU: {product.idsku}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Preço:</span>
                      <span className="text-sm font-medium text-green-400">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Oferta:</span>
                      <span className="text-sm font-medium text-blue-400">
                        {formatPrice(product.offer)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500">
                      Criado em{' '}
                      {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {deleteModal.isOpen && deleteModal.product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                Confirmar Exclusão
              </h3>
              <button
                onClick={cancelDelete}
                disabled={deleteModal.isDeleting}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Tem certeza que deseja excluir este produto?
              </p>
              <div className="bg-gray-700 rounded-md p-3">
                <h4 className="text-sm font-medium text-white mb-1">
                  {deleteModal.product.title}
                </h4>
                <p className="text-xs text-gray-400">
                  SKU: {deleteModal.product.idsku} •{' '}
                  {getTypeLabel(deleteModal.product.productType)}
                </p>
              </div>
              <p className="text-sm text-red-400 mt-3">
                ⚠️ Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleteModal.isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteModal.isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {deleteModal.isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
