import supabase from '@lib/supabase'


// Get Item
export const getItems = async () => {


    const [incomesR, expensesR] = await Promise.all([
        supabase
            .from(`incomes`)
            .select('income_id, amount, description, created_at, category_id, user_id'),
        supabase
            .from(`expenses`)
            .select('expense_id, amount, description, created_at, category_id, user_id'),
    ])

    const incomes = (incomesR.data ?? []).map(i => ({
        amount: i.amount as number,
        description: i.description as string,
        id: i.income_id as string,
        created_at: i.created_at as number,
        category_id: i.category_id as number,
        user_id: i.user_id as number,
        type: 'incomes' as const
    }))

    const expenses = (expensesR.data ?? []).map(i => ({
        amount: i.amount as number,
        description: i.description as string,
        id: i.expense_id as string,
        created_at: i.created_at as number,
        category_id: i.category_id as number,
        user_id: i.user_id as number,
        type: 'expenses' as const
    }))


    return [...incomes, ...expenses]


    // [
    //   { amount, type, desc, cat, date }
    // ]
}

// Create Item
export const createItem = async (user_id: string, amount: number, created_at: Date, description: string, category_id: number, type: any) => {
    const { data: item, error } = await supabase
        .from(`${type}s`)
        .insert([
            { user_id, amount, created_at, description, category_id },
        ])
        .select()

    if (error) {
        console.log(`Insert ${type} error | item.ts: `, error)
    }

    return item
}