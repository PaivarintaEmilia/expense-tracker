import Link from 'next/link'
//import supabase from '@lib/supabase'


type IncomeData = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => {},
    amountOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    descriptionOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    amount: number, 
    description: string,

}


export default function AddDataForm({onSubmit, amountOnChange, descriptionOnChange, amount, description}:IncomeData) {
    return (
        <div className="">
            <form onSubmit={onSubmit}>
                <label htmlFor="email">Income amount:</label>
                <input
                    type="number"
                    id="incomeAmount"
                    value={amount}
                    onChange={amountOnChange}
                    required
                />
                <label htmlFor="email">Income description:</label>
                <input
                    type="text"
                    id="incomeDescription"
                    value={description}
                    onChange={descriptionOnChange}
                />
                <button type="submit">Add Income</button>
            </form>
        </div>
    )
}
