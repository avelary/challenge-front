// Tipos principais (primeiro select)
export const productTypes = [
  { value: 'souvenir', label: 'Souvenir' },
  { value: 'menu', label: 'Menu' },
  { value: 'vestuario', label: 'Vestuário' },
]

// Classificações por tipo
export const classificationsByType = {
  souvenir: [
    { value: 'artesanato', label: 'Artesanato' },
    { value: 'colecionavel', label: 'Colecionável' },
    { value: 'local', label: 'Local' },
  ],
  menu: [
    { value: 'entrada', label: 'Entrada' },
    { value: 'prato_principal', label: 'Prato Principal' },
    { value: 'bebida', label: 'Bebida' },
  ],
  vestuario: [
    { value: 'camiseta', label: 'Camiseta' },
    { value: 'bone', label: 'Boné' },
    { value: 'moletom', label: 'Moletom' },
  ],
}

// Categorias por classificação
export const categoriesByClassification = {
  // Souvenir > Artesanato
  artesanato: [
    { value: 'madeira', label: 'Madeira' },
    { value: 'ceramica', label: 'Cerâmica' },
    { value: 'tecido', label: 'Tecido' },
  ],
  // Souvenir > Colecionável
  colecionavel: [
    { value: 'moeda', label: 'Moeda' },
    { value: 'selo', label: 'Selo' },
    { value: 'miniatura', label: 'Miniatura' },
  ],
  // Souvenir > Local
  local: [
    { value: 'lembranca', label: 'Lembrança' },
    { value: 'cartao_postal', label: 'Cartão Postal' },
    { value: 'imas', label: 'Ímãs' },
  ],
  // Menu > Entrada
  entrada: [
    { value: 'salada', label: 'Salada' },
    { value: 'sopa', label: 'Sopa' },
    { value: 'petisco', label: 'Petisco' },
  ],
  // Menu > Prato Principal
  prato_principal: [
    { value: 'carne', label: 'Carne' },
    { value: 'peixe', label: 'Peixe' },
    { value: 'vegetariano', label: 'Vegetariano' },
  ],
  // Menu > Bebida
  bebida: [
    { value: 'suco', label: 'Suco' },
    { value: 'refrigerante', label: 'Refrigerante' },
    { value: 'alcoolica', label: 'Alcoólica' },
  ],
  // Vestuário > Camiseta
  camiseta: [
    { value: 'manga_curta', label: 'Manga Curta' },
    { value: 'manga_longa', label: 'Manga Longa' },
    { value: 'regata', label: 'Regata' },
  ],
  // Vestuário > Boné
  bone: [
    { value: 'aba_reta', label: 'Aba Reta' },
    { value: 'aba_curva', label: 'Aba Curva' },
    { value: 'trucker', label: 'Trucker' },
  ],
  // Vestuário > Moletom
  moletom: [
    { value: 'com_capuz', label: 'Com Capuz' },
    { value: 'sem_capuz', label: 'Sem Capuz' },
    { value: 'ziper', label: 'Com Zíper' },
  ],
}

// Funções auxiliares para obter as opções
export const getClassificationsByType = (type: string) => {
  return classificationsByType[type as keyof typeof classificationsByType] || []
}

export const getCategoriesByClassification = (classification: string) => {
  return (
    categoriesByClassification[
      classification as keyof typeof categoriesByClassification
    ] || []
  )
}

// Outras opções (não dependentes)
export const partners = [
  { value: '1', label: 'Parceiro A' },
  { value: '2', label: 'Parceiro B' },
  { value: '3', label: 'Parceiro C' },
  { value: '4', label: 'Parceiro D' },
]

export const printers = [
  { value: '1', label: 'Impressora 3D A' },
  { value: '2', label: 'Impressora 3D B' },
  { value: '3', label: 'Impressora 3D C' },
]

export const measureUnits = [
  { value: 'g', label: 'Gramas (g)' },
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'un', label: 'Unidades (un)' },
  { value: 'par', label: 'Pares' },
]

export const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'released', label: 'Liberado' },
  { value: 'inactive', label: 'Inativo' },
]
