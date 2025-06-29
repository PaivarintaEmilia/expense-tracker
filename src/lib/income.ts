import supabase from '@lib/supabase'


/* Get Income_amount from Income-table */
export const getIncome = async () => {
    const { data: income, error } = await supabase
        .from('income')
        .select('income_amount')

    if (error || !income) {
        console.error('There was an error while fetching the data', error)
        return []
    }
    return income
}


/** Create Income */
export const createIncome = async (user_id: string, income_amount: number, income_created_at: Date) => {

    const { data: income, error } = await supabase
        .from('income')
        .insert([
            { user_id: 'user_id', income_amount: 'income_amount', income_created_at: 'income_created_at' },
        ])
        .select()

    return income
}

export const updateIncome = async (incomeID: any) => {
    const { data: income, error } = await supabase.from('income').update(incomeID)
    return income
}

export const deleteIncome = async (incomeID: any) => {
    const { data: income, error } = await supabase.from('income').delete(incomeID)
    return income
}