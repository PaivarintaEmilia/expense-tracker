import supabase from '@lib/supabase'

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

export const createIncome = async (amount: any) => {
    const { data: income, error } = await supabase.from('income').insert(amount)
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