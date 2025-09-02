import supabase from '@lib/supabase'


/* Get name and id from categories-table */
export const getCategories = async () => {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')

    if (error || !categories) {
        console.error('There was an error while fetching the categories data: ', error)
        return []
    }

    console.log('Categories data fetched: ', categories)

    return categories
}


