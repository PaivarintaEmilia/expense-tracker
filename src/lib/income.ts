import supabase from '@lib/supabase'


/* Get amount, description and id from Income-table */
export const getIncome = async () => {
    const { data: incomes, error } = await supabase
        .from('incomes')
        .select('income_amount, income_description, income_id')

    if (error || !incomes) {
        console.log('There was an error while fetching the income data: ', error)
        return []
    }

    console.log('Income data: ', incomes)

    return incomes
}


/** Create Income */
export const createIncome = async (user_id: string, income_amount: number, income_created_at: Date, income_description: string, category_id: number) => {

    const { data: income, error } = await supabase
        .from('incomes')
        .insert([
            { user_id, income_amount, income_created_at, income_description, category_id },
        ])
        .select()

    if (error) {
        console.log('Insert Income error: ', error)
    }

    return income
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