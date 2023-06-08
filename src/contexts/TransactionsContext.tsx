import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

interface TransactionProps {
  id: number
  description: string
  type: 'income' | 'outcome'
  value: number
  category: string
  createdAt: string
}

interface CreateTransactionData {
  description: string
  value: number
  category: string
  type: 'income' | 'outcome'
}

interface TransactionContextType {
  transactions: TransactionProps[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionData) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<TransactionProps[]>([])

  const fetchTransactions = useCallback(async(query?: string) => {
    const response = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })
    setTransactions(response.data)
  }, [])

  const createTransaction = useCallback(async(data: CreateTransactionData) => {
    const { category, description, type, value } = data
    const response = await api.post('/transactions', {
      category,
      description,
      type,
      value,
      createdAt: new Date(),
    })

    setTransactions((state) => [response.data, ...state])
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])
  
  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
