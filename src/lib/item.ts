import supabase from '@lib/supabase'


// Get Item
export const getItems = async () => {


    const [incomesR, expensesR] = await Promise.all([
        supabase
            .from(`incomes`)
            .select('id, amount, description, created_at, category_id, user_id'),
        supabase
            .from(`expenses`)
            .select('id, amount, description, created_at, category_id, user_id'),
    ])

    const incomes = (incomesR.data ?? []).map(i => ({
        amount: i.amount as number,
        description: i.description as string,
        id: i.id as string,
        created_at: i.created_at as number,
        category_id: i.category_id as number,
        user_id: i.user_id as number,
        type: 'incomes' as const
    }))

    const expenses = (expensesR.data ?? []).map(i => ({
        amount: i.amount as number,
        description: i.description as string,
        id: i.id as string,
        created_at: i.created_at as number,
        category_id: i.category_id as number,
        user_id: i.user_id as number,
        type: 'expenses' as const
    }))


    return [...incomes, ...expenses]

}

// Create Item
export const createItem = async (user_id: string, amount: number, created_at: Date, description: string, category_id: number, type: any) => {
    const { data: item, error } = await supabase
        .from(`${type}`)
        .insert([
            { user_id, amount, created_at, description, category_id },
        ])
        .select()

    if (error) {
        console.log(`Insert ${type} error | item.ts: `, error)
    }

    return item
}


// Update item
export const updateItem = async (income_id: number, income_amount: number, income_description: string) => {

    console.log('Updating income with ID:', income_id, typeof income_id)

    const { data: income, error } = await supabase
        .from('incomes')
        .update({ income_amount, income_description  })
        .eq('income_id', income_id)
        .select()

    if (error) {
        console.log("Error while updating Income item: ", error)
    }

    console.log('Updated income data: ', income)

    return "income, updated"

}


/** Delete item */
export const deleteItem = async (id: number, type: string) => {

    if (!id) return;
    //const parsedId = parseInt(income_id, 10);

    const { error } = await supabase
        .from(`${type}`)
        .delete()
        .eq('id', id)

    if (error) {
        console.log('Error while deleting income-table row: ', error)
    }

}
