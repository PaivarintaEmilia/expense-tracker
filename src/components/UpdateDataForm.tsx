//import supabase from '@lib/supabase'


type IncomeData = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    amountOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    descriptionOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    cancelFunction: () => void,
    amount: number,
    description: string,
}


export default function UpdateDataForm({ onSubmit, amountOnChange, descriptionOnChange, cancelFunction, amount, description }: IncomeData) {
    return (
        <div className="
            flex flex-col gap-5
            "
        >
            <h2 className="text-[16px] md:text-[18px] w-full text-center">Update Form</h2>
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
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
                        w-35
                        self-center
                        inline-flex items-center justify-center
                        rounded-md
                        border border-sky-300
                        px-4 py-2
                        text-[15px] font-bold
                        text-white-900
                        transition
                        hover:bg-stone-700 hover:shadow 
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
                        active:translate-y-[1px]
                        disabled:opacity-50 disabled:cursor-not-allowed
                        cursor-pointer
                    "
                >Update</button>
                <button
                    type="button"
                    onClick={cancelFunction}
                    className="             
                        inline-flex items-center
                        text-[18px] font-normal
                        mt-2
                        cursor-pointer
                        self-center
                    "
                >Cancel</button>
            </form>
        </div>
    )
}
