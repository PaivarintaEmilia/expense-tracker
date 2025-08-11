//import supabase from '@lib/supabase'


type IncomeData = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => {},
    amountOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    descriptionOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    cancelFunction: () => void,
    amount: number, 
    description: string,
}


export default function UpdateDataForm({onSubmit, amountOnChange, descriptionOnChange, cancelFunction, amount, description}:IncomeData) {
    return (
        <div className="">
            <h2>Update Form</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="email">Amount:</label>
                <input
                    type="number"
                    id="incomeAmount"
                    value={amount}
                    onChange={amountOnChange}
                    required
                />
                <label htmlFor="email">Description:</label>
                <input
                    type="text"
                    id="incomeDescription"
                    value={description}
                    onChange={descriptionOnChange}
                />
                <button type="submit">Update</button>
                <button type="button" onClick={cancelFunction}>Cancel</button>
            </form>
        </div>
    )
}
