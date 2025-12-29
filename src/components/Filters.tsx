import { Categories } from '@lib/types/db'

type SearchType = 'incomes' | 'expenses'

type FiltersProps = {
    categories: Categories[]

    searchCategoryId: number | ''
    setSearchCategoryId: React.Dispatch<React.SetStateAction<number | ''>>

    searchType: SearchType
    setSearchType: React.Dispatch<React.SetStateAction<SearchType>>

    startDate: string
    setStartDate: React.Dispatch<React.SetStateAction<string>>

    endDate: string
    setEndDate: React.Dispatch<React.SetStateAction<string>>

    // optional, mutta sama tyyli kuin AddDataFormissa (onSubmit prop)
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}



export default function Filters(
    {
        categories,
        searchCategoryId,
        setSearchCategoryId,
        searchType,
        setSearchType,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        onSubmit,
    }: FiltersProps
) {
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <h2 className="text-[23px] mb-[35px]">Search items</h2>
            {/** Filter for categories */}
            <form className="w-[300px] mb-[35px]">
                <label>Category</label>
                <select
                    className="
                                w-full
                                border border-neutral-600
                                rounded-md
                                px-3 py-2
                                text-gray-200 font-light
                                outline-none
                                hover:border-gray-400
                                focus:border-sky-200 focus:ring-0.5 focus:ring-sky-200
                            "
                    onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setSearchCategoryId(value)
                    }}
                    value={searchCategoryId}
                >
                    <option
                        value=""
                        className="bg-neutral-800 text-white"
                    >Select category</option>
                    {categories.map(option => (
                        <option
                            key={option.category_id}
                            value={option.category_id}
                            className="
                                bg-neutral-800 
                                text-white
                                checked:bg-sky-900 checked:text-neutral-200
                            "   
                        >
                            {option.category_name}
                        </option>
                    ))}
                </select>

                {/**Filter for select type incomes or expenses */}
                <fieldset>
                    <legend>Select the type:</legend>
                    <div>
                        <label htmlFor="income">
                            <input
                                type="radio"
                                id="income"
                                name="item_type"
                                value="incomes"
                                checked={searchType === 'incomes'}
                                onChange={() => setSearchType('incomes')}
                            />
                            <span>Income</span>
                        </label>
                        <label htmlFor="expense">
                            <input
                                type="radio"
                                id="expense"
                                name="item_type"
                                value="expenses"
                                checked={searchType === 'expenses'}
                                onChange={() => setSearchType('expenses')}
                            />
                            <span>Expense</span>
                        </label>
                    </div>
                </fieldset>
                {/** Filter for selecting dates */}
                <label>Time range</label>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-1 w-1/2">
                        <span className="text-[12px] text-gray-300">From</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-neutral-600 rounded-md px-3 py-2 bg-transparent"
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-1/2">
                        <span className="text-[12px] text-gray-300">To</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-neutral-600 rounded-md px-3 py-2 bg-transparent"
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}