//import supabase from '@lib/supabase'


type IncomeData = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    amountOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    descriptionOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    amount: number, 
    description: string,

}


export default function AddDataForm({onSubmit, amountOnChange, descriptionOnChange, amount, description}:IncomeData) {
    return (
            <form 
                className="
                    flex flex-col justify-start gap-2.5
                    w-full
                    mt-4
                "
                onSubmit={onSubmit}>
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
                    value={description}
                    onChange={descriptionOnChange}
                />
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
