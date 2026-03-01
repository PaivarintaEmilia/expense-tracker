import supabase from '@lib/supabase'

// Get items (incomes & expenses)
export const getItems = async (user_id: string) => {
    const [incomesData, expensesData] = await Promise.all([
        supabase
            .from(`incomes`)
            .select(
                'id, amount, description, created_at, category_id, user_id',
            )
            .eq('user_id', user_id),
        supabase
            .from(`expenses`)
            .select(
                'id, amount, description, created_at, category_id, user_id',
            )
            .eq('user_id', user_id),
    ])

    if (incomesData.error) throw incomesData.error
    if (expensesData.error) throw expensesData.error

    const incomes = (incomesData.data ?? []).map((i) => ({
        amount: i.amount as number,
        description: i.description as string,
        id: i.id as string,
        created_at: i.created_at as string,
        category_id: i.category_id as number,
        user_id: i.user_id as string,
        type: 'incomes' as const,
    }))

    const expenses = (expensesData.data ?? []).map((i) => ({
        amount: i.amount as number,
        description: i.description as string,
        id: i.id as string,
        created_at: i.created_at as string,
        category_id: i.category_id as number,
        user_id: i.user_id as string,
        type: 'expenses' as const,
    }))

    console.log(expenses[2].created_at)

    return [...incomes, ...expenses]
}

// Create Item
export const createItem = async (
    user_id: string,
    amount: number,
    description: string,
    created_at: Date,
    category_id: number,
    type: string,
) => {
    const { data: item, error } = await supabase
        .from(`${type}`)
        .insert([{ user_id, category_id, amount, created_at, description }])
        .select()

    if (error) {
        console.log(`Insert ${type} error | item.ts: `, error)
        throw error
    }

    return item
}

// Update item
export const updateItem = async (
    id: number,
    amount: number,
    description: string,
    category_id: number,
    type: string,
) => {
    console.log('Updating item with ID:', id, typeof id)

    const { data: updatedItem, error } = await supabase
        .from(`${type}`)
        .update({ amount, description, category_id })
        .eq('id', id)
        .select()

    if (error) {
        console.log('Error while updating item: ', error)
    }

    console.log('Updated item data from item.ts: ', updatedItem)

    return 'Item, updated'
}

/** Delete item */
export const deleteItem = async (id: number, type: string) => {
    if (!id) return

    const { error } = await supabase.from(`${type}`).delete().eq('id', id)

    if (error) {
        console.log('Error while deleting income-table row: ', error)
    }
}
