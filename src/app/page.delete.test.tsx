import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'
import HomeClient from './HomeClient'


// Mockataan next/navigation ettei tule redirect / router-ongelmia
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}))

// Mockataan supabase session, koska page.tsx tarkistaa authin mountissa
jest.mock('@/lib/supabase', () => ({
  __esModule: true,
  default: {
    auth: {
      getSession: jest.fn(() =>
        Promise.resolve({ data: { session: { user: { id: 'u1' } } } }),
      ),
      getUser: jest.fn(() =>
        Promise.resolve({ data: { user: { id: 'u1' } } }),
      ),
    },
  },
}))

// Mockataan backend-funktiot joita page.tsx käyttää
jest.mock('@/lib/item', () => ({
  getItems: jest.fn(),
  createItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn(),
}))

jest.mock('@lib/categories', () => ({
  getCategories: jest.fn(),
  createCategories: jest.fn(),
}))

import { getItems, deleteItem } from '@/lib/item'
import { getCategories } from '@lib/categories'

const mockedDeleteItem = jest.mocked(deleteItem)
const mockedGetItems = jest.mocked(getItems)
const mockedGetCategories = jest.mocked(getCategories)

describe('Expense deletion flow', () => {
  test('user can delete an expense via hover -> delete -> confirm', async () => {
    ;mockedGetCategories.mockResolvedValue([])

    // 1) Alussa meillä on kaksi expense-itemiä listalla
    ;mockedGetItems.mockResolvedValueOnce([
        {
          id: '12',
          type: 'expenses' as const,
          amount: 4.5,
          description: 'Coffee',
          category_id: 2,
          created_at: 20250905,
          user_id: '7130ed24-d923-4e0c-a0c1-9f62e3524fdb',
        },
        {
          id: '13',
          type: 'expenses',
          amount: 17,
          description: 'Food uno',
          category_id: 1,
          created_at: 20250905,
          user_id: '7130ed24-d923-4e0c-a0c1-9f62e3524fdb',
        },
      ])
      // 2) Poiston jälkeen "refetch" palauttaa listan ilman Coffee-itemiä
      .mockResolvedValueOnce([
        {
          id: '13',
          type: 'expenses',
          amount: 17,
          description: 'Food uno',
          category_id: 1,
          created_at: 20250905,
          user_id: '7130ed24-d923-4e0c-a0c1-9f62e3524fdb',
        },
      ])

    ;mockedDeleteItem.mockResolvedValue(undefined)

    const user = userEvent.setup()
    render(<HomeClient />)

    // Varmistetaan että molemmat näkyy
    expect(await screen.findByText(/Coffee/i)).toBeInTheDocument()
    expect(screen.getByText(/Food uno/i)).toBeInTheDocument()

    // Hoverataan Coffee-riviä (delete-nappi ilmestyy hoverin jälkeen)
    const coffeeText = screen.getByText(/Coffee/i)
    const coffeeRow = coffeeText.closest('li')
    expect(coffeeRow).not.toBeNull()

    await user.hover(coffeeRow!)

    // Nyt "Delete" nappi pitäisi löytyä tämän rivin sisältä
    const deleteBtn = within(coffeeRow!).getByRole('button', { name: 'Delete' })
    await user.click(deleteBtn)

    // Delete-modal pitäisi aueta (role="dialog")
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Klikataan "Yes"
    await user.click(screen.getByRole('button', { name: 'Yes' }))

    // Varmistetaan että deleteItem kutsuttiin oikein
    await waitFor(() => {
      expect(deleteItem).toHaveBeenCalledWith(12, 'expenses')
    })

    // Coffee häviää listalta, Lunch jää näkyviin
    await waitFor(() => {
      expect(screen.queryByText(/Coffee/i)).not.toBeInTheDocument()
    })
    expect(screen.getByText(/Food uno/i)).toBeInTheDocument()
  })
})
