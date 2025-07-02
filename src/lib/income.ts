import supabase from '@lib/supabase'


/* Get amount, description and id from Income-table */
export const getIncome = async () => {
    const { data: incomes, error } = await supabase
        .from('incomes')
        .select('income_amount, income_description, income_id')

    if (error || !incomes) {
        console.error('There was an error while fetching the income data: ', error)
        return []
    }

    console.log('Income data: ', incomes)

    return incomes
}


/** Create Income */
export const createIncome = async (user_id: string, income_amount: number, income_created_at: Date, income_description: string) => {

    const { data: income, error } = await supabase
        .from('incomes')
        .insert([
            { user_id, income_amount, income_created_at, income_description },
        ])
        .select()

    if (error) {
        console.log('Insert Income error: ', error)
    }

    return income
}

/** Update income */
export const updateIncome = async (incomeID: any) => {
    const { data: income, error } = await supabase.from('income').update(incomeID)
    return income
}


/** Delete Income */
export const deleteIncome = async (income_id: string | null) => {

    if (!income_id) return;
    const parsedId = parseInt(income_id, 10);

    const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('income_id', income_id)

    if (error) {
        console.log('Error while deleting income-table row: ', error)
    }

}