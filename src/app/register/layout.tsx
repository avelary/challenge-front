'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

interface RegisterLayoutProps {
  children: ReactNode
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 py-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 sm:py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left">
              Sistema de Cadastros
            </h1>
            <nav className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 lg:space-x-8">
              <Link
                href="/register/product"
                className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center sm:text-left"
              >
                Cadastrar Produto
              </Link>
              <Link
                href="/register/type"
                className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center sm:text-left"
              >
                Cadastrar Tipo
              </Link>
              <Link
                href="/"
                className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center sm:text-left"
              >
                Voltar
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
