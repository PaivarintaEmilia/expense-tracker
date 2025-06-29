import Link from 'next/link'
//import supabase from '@lib/supabase'


type IncomeData = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => {},
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: number, 

}


export default function AddDataForm({onSubmit, onChange, value}:IncomeData) {
    return (
        <div className="">
            <form onSubmit={onSubmit}>
                <label htmlFor="email">Income amount:</label>
                <input
                    type="number"
                    id="incomeAmount"
                    value={value}
                    onChange={onChange}
                    required
                />
                <button type="submit">Add Income</button>
            </form>
        </div>
    )
}
