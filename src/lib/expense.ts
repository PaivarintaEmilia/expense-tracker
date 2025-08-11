import supabase from '@lib/supabase'


/* Get amount, description and id from Income-table */
export const getExpenses = async () => {
    const { data: expenses, error } = await supabase
        .from('expenses')
        .select('expense_amount, expense_description, expense_id')

    if (error || !expenses) {
        console.error('There was an error while fetching the expense data: ', error)
        return []
    }

    console.log('Expense data fetched: ', expenses)

    return expenses
}

/** Create Expense */
export const createExpense = async (user_id: string, expense_amount: number, expense_created_at: Date, expense_description: string) => {

    const { data: expense, error } = await supabase
        .from('expenses')
        .insert([
            { user_id, expense_amount, expense_created_at, expense_description },
        ])
        .select()

    if (error) {
        console.log('Insert Expense error | expense.ts: ', error)
    }

    return expense
}

/** Update expense */
export const updateExpense = async (expense_id: number, expense_amount: number, expense_description: string) => {

    console.log('Updating income with ID:', expense_id, typeof expense_id)

    const { data: expense, error } = await supabase
        .from('expenses')
        .update({ expense_amount, expense_description  })
        .eq('expense_id', expense_id)
        .select()

    if (error) {
        console.log("Error while updating expense item: ", error)
    }

    console.log('Updated expense data: ', expense)

    return "expense, updated"

}


/** Delete Income */
export const deleteIncome = async (income_id: number) => {

    if (!income_id) return;
    //const parsedId = parseInt(income_id, 10);

    const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('income_id', income_id)

    if (error) {
        console.log('Error while deleting income-table row: ', error)
    }

}