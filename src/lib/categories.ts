import supabase from '@lib/supabase';

/* Get name and id from categories-table */
export const getCategories = async () => {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*');

    if (error || !categories) {
        console.error(
            'There was an error while fetching the categories data: ',
            error,
        );
        return [];
    }

    console.log('Categories data fetched: ', categories);

    return categories;
};

/** Create a new category */
export const createCategories = async (category_name: string) => {
    const { data: category, error } = await supabase
        .from('categories')
        .insert([{ category_name, user_defined: true }])
        .select();

    if (error) {
        console.log(`Insert category error | categories.ts: `, error);
    }

    return category;
};
