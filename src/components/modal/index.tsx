// React
import { useState } from 'react'
import { z } from 'zod'

// UI & Icons
import { X } from 'lucide-react'
import { Input } from '../input/input'
import { Select } from '../select/select'

// Hooks
import { useOpcionalList } from './hooks/useOpcionalList'
import { useRemoveList } from './hooks/useRemoveList'
import { useDatasheetList } from './hooks/useDataSheetList'

// Components
import { OpcionalList } from './components/opcionalList'
import { RemoveList } from './components/removeList'
import { DataSheetList } from './components/dataSheetList'
import { UploadImage } from './components/uploadImage'

// Schemas & Types
import { productSchema } from './schemas/productSchema'
import { ProductFormInput } from './types/product'

// Options
import {
  productTypes,
  categoriesByProductType,
  categoryClassifications,
  productStatusOptions,
  partnerOptions,
  measureUnits,
  printerOptions,
  ProductCategoryValue,
  getCategoryOptionsByProductType,
  getClassificationOptionsByCategory,
} from './types/product-options'

interface ProductModalProps {
  open: boolean
  setOpen: (isOpen: boolean) => void
}

export const ProductModal = ({ open, setOpen }: ProductModalProps) => {
  // --------------------------
  // States
  // --------------------------
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategoryValue | ''
  >('')

  const [formState, setFormState] = useState<ProductFormInput>({
    title: '',
    productType: '',
    idca: '',
    idcl: '',
    idPartner: '',
    idPrinter: null,
    image: null,
    measure: '',
    quantity: null,
    price: '',
    offer: '',
    description: null,
    remove: null,
    include: null,
    datasheet: null,
    status: 'pending',
  })

  const classificationOptions =
    getClassificationOptionsByCategory(selectedCategory)

  // --------------------------
  // Custom Hooks
  // --------------------------
  const {
    remover,
    handleAddRemover,
    handleRemoveRemover,
    handleChangeRemover,
    handleSaveRemover,
  } = useRemoveList(setFormState)

  const {
    opcionais,
    handleAddOpcional,
    handleRemoveOpcional,
    handleChangeOpcional,
    handleSaveOpcionais,
  } = useOpcionalList(setFormState)

  const {
    datasheet,
    handleAddDatasheet,
    handleRemoveDatasheet,
    handleChangeDatasheet,
    handleSaveDatasheet,
  } = useDatasheetList(setFormState, formState.productType)

  // --------------------------
  // Form Submit Handler
  // --------------------------
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const parsedData = productSchema.parse(formState)

      const response = await fetch('http://localhost:3333/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      })

      if (!response.ok) {
        throw new Error('Erro ao cadastrar o produto.')
      }

      const data = await response.json()
      console.log('Produto cadastrado com sucesso:', data)
      // Aqui você pode fechar o modal ou limpar o formState
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('Validation errors:', error.flatten().fieldErrors)
      } else {
        console.error('Erro no envio:', error)
      }
    }
  }

  // --------------------------
  // JSX
  // --------------------------
  return (
    <form className="fixed overflow-y-auto top-0 left-0 w-full h-[100vh] rounded-md bg-[#212121] pl-6 pr-6 pt-6">
      {/* Header */}
      <div className="flex justify-between">
        <Select
          label="Product Type"
          options={productTypes}
          value={formState.productType}
          onChange={value => {
            setFormState(prev => ({
              ...prev,
              productType: value,
            }))
            setSelectedCategory('')
          }}
        />
        <X onClick={() => setOpen(!open)} color="#ffffff" />
      </div>

      {/* Dados Gerais */}
      <div className="mt-[1rem] px-[1rem] py-[1rem] border border-[#878789] rounded-md">
        <div className="pb-[1rem]">
          <h1 className="font-[600]">Dados Gerais</h1>
        </div>

        <Input
          type="text"
          value={formState.title}
          label="Product Title"
          placeholder="Example"
          onChange={e => setFormState({ ...formState, title: e.target.value })}
        />

        <div className="gap-[1rem] grid grid-cols-2 pb-[1rem]">
          <Select
            label="Category"
            options={
              formState.productType
                ? getCategoryOptionsByProductType(formState.productType)
                : []
            }
            value={formState.idca}
            onChange={selectedId => {
              const selected = categoriesByProductType[
                formState.productType
              ]?.find(cat => cat.id === selectedId)

              setFormState(prev => ({
                ...prev,
                idca: selectedId,
              }))

              setSelectedCategory(selected?.value ?? '')
            }}
          />

          <Select
            label="Classification"
            options={classificationOptions}
            value={formState.idcl}
            onChange={selectedId => {
              const selected = categoryClassifications[
                selectedCategory as ProductCategoryValue
              ]?.find(c => c.id === selectedId)

              setFormState(prev => ({
                ...prev,
                idcl: selectedId,
              }))
            }}
          />

          <Select
            label="Status"
            options={productStatusOptions}
            value={formState.status}
            onChange={value => setFormState({ ...formState, status: value })}
          />

          <Select
            label="Partner"
            options={partnerOptions}
            value={formState.idPartner}
            onChange={value => setFormState({ ...formState, idPartner: value })}
          />

          <Input
            label="Quantity"
            placeholder="10.000"
            value={formState.quantity?.toString() ?? ''}
            onChange={e =>
              setFormState({ ...formState, quantity: e.target.value })
            }
          />

          <Select
            label="Measure"
            options={measureUnits}
            value={formState.measure}
            onChange={value => setFormState({ ...formState, measure: value })}
          />

          <Input
            label="Price"
            placeholder="R$99,99"
            value={formState.price}
            onChange={e =>
              setFormState({ ...formState, price: e.target.value })
            }
          />

          <Input
            label="Promotional Price"
            placeholder="R$0,00"
            value={formState.offer}
            onChange={e =>
              setFormState({ ...formState, offer: e.target.value })
            }
          />
        </div>

        <div>
          <Input
            label="Description"
            value={formState.description ?? ''}
            onChange={e =>
              setFormState({ ...formState, description: e.target.value })
            }
          />

          <Select
            label="Printer"
            options={printerOptions}
            value={formState.idPrinter ?? ''}
            onChange={value => setFormState({ ...formState, idPrinter: value })}
          />
        </div>
      </div>

      {/* Upload da Imagem */}
      <UploadImage
        initialImageUrl={formState.image || undefined}
        onUploadComplete={url =>
          setFormState(prev => ({ ...prev, image: url }))
        }
      />

      {/* Opcionais e Remover - apenas para menus */}
      {formState.productType === 'menu' && (
        <>
          <OpcionalList
            opcionais={opcionais}
            onAdd={handleAddOpcional}
            onRemove={handleRemoveOpcional}
            onChange={handleChangeOpcional}
            onSaveToForm={handleSaveOpcionais}
          />

          <RemoveList
            remover={remover}
            onAdd={handleAddRemover}
            onRemove={handleRemoveRemover}
            onChange={handleChangeRemover}
            onSaveToForm={handleSaveRemover}
          />
        </>
      )}

      <DataSheetList
        datasheet={datasheet}
        productType={formState.productType}
        onAdd={handleAddDatasheet}
        onRemove={handleRemoveDatasheet}
        onChange={handleChangeDatasheet}
        onSaveToForm={handleSaveDatasheet}
      />

      {/* Submit */}
      <button
        className="self-end mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={handleFormSubmit}
      >
        Create
      </button>
    </form>
  )
}
