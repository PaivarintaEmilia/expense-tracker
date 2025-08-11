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

/** Update income */
export const updateIncome = async (income_id: number, income_amount: number, income_description: string) => {

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