import { useContextSelector } from 'use-context-selector'

import { Header } from '../../components/Header'
import { SearchForm } from '../../components/SearchForm'
import { Summary } from '../../components/Summary'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { dateFormatter, priceFormatter } from '../../utils/formatter'

import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable
} from './styles'

export function Transactions() {
  const transactions = useContextSelector(TransactionsContext, (context) => {
    return context.transactions
  })

  return (
    <>
      <Header />
      <Summary />

      <TransactionsContainer>
        <SearchForm />

        <TransactionsTable>
          <tbody>
            {transactions.map((t) => {
              return (
                <tr key={t.id}>
                  <td width="40%">{t.description}</td>
                  <td>
                    <PriceHighlight variant={t.type}>
                      {t.type === 'outcome' && '- '}
                      {priceFormatter.format(t.value)}
                    </PriceHighlight>
                  </td>
                  <td>{t.category}</td>
                  <td>{dateFormatter.format(new Date(t.createdAt))}</td>
                </tr>
              )
            })}
          </tbody>
        </TransactionsTable>
      </TransactionsContainer>
    </>
  )
}
