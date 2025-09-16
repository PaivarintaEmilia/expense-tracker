import { Categories } from '@lib/types/db'


type IncomeData = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    amountOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    descriptionOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    selectedCategoryOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    amount: string,
    description: string,
    categoryId: number | "",
    categoriesList: Categories[],
}


export default function AddDataForm({ onSubmit, amountOnChange, descriptionOnChange, selectedCategoryOnChange, amount, description, categoryId, categoriesList }: IncomeData) {
    return (
        <form
            className="
                    flex flex-col justify-start gap-2.5
                    w-full
                    mt-4
                "
            onSubmit={onSubmit}>
            <fieldset>
                <legend>Select the type:</legend>
                <div>
                    <label htmlFor="income">
                        <input type="radio" id="income" name="item_type" value="income" defaultChecked />
                        <span>Income</span>
                    </label>
                    <label htmlFor="expense">
                        <input type="radio" id="expense" name="item_type" value="expense" />
                        <span>Expense</span>
                    </label>
                </div>
            </fieldset>

            <label htmlFor="email">Amount:</label>
            <input
                className="                            
                        w-full
                        rounded-md
                        border border-neutral-600
                        px-3 py-2
                        text-gray-200 font-light
                        outline-none
                        transition
                        hover:border-gray-400
                        focus:border-sky-200 focus:ring-0.5 focus:ring-sky-200
                    "
                placeholder="Amount"
                type="number"
                id="incomeAmount"
                value={amount}
                onChange={amountOnChange}
                required
            />
            <label htmlFor="email">Description:</label>
            <input
                className="                            
                        w-full
                        rounded-md
                        border border-neutral-600
                        px-3 py-2
                        text-gray-200 font-light
                        outline-none
                        transition
                        hover:border-gray-400
                        focus:border-sky-200 focus:ring-0.5 focus:ring-sky-200
                    "
                type="text"
                id="incomeDescription"
                placeholder="Description"
                value={description}
                onChange={descriptionOnChange}
            />
            {/** Select the category */}
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
                onChange={selectedCategoryOnChange}
                value={categoryId}
            >
                <option value="">Select category</option>
                {categoriesList.map(option => (
                    <option key={option.category_id} value={option.category_id}>
                        {option.category_name}
                    </option>
                ))}
            </select>

            <button
                type="submit"
                className="
                        mt-2
                        inline-flex items-center justify-center
                        rounded-md
                        border border-sky-300
                        px-4 py-2
                        text-[15px] font-bold
                        text-white-900
                        transition
                        hover:bg-stone-800 hover:shadow 
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
                        active:translate-y-[1px]
                        disabled:opacity-50 disabled:cursor-not-allowed
                        cursor-pointer
                    "
            >Create</button>
        </form>
    )
}
