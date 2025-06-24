'use client'
import React, { useState, useEffect } from 'react'
import { getIncome, createIncome } from '@/lib/income'
import session from '@hooks/session'
import AddDataFOrm from '@components/AddDataForm'
import supabase from '@/lib/supabase'


/* Type */
type IncomeAmount = {
    income_amount: number
}

export default function Home() {

    session()

    const [amount, setAmount] = useState<IncomeAmount[]>([])
    const [income, setIncome] = useState<number>(0)

    useEffect(() => {
        async function fetchIncome() {
            const amountData = await getIncome()
            console.log("getIncomeData: ", amountData)
            setAmount(amountData)
        }
        fetchIncome()
    }, [])

    /* Creat new Income*/
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { data: { user } } = await supabase.auth.getUser()
        console.log('User ID: ', user?.id)
        const userId = user?.id

        const date = new Date();

        createIncome(userId, income, date)





    }



    return (
        <div className="">
            <h1>test</h1>
            <ul>
                {amount.map((item, index) => (
                    <li key={index}>{item.income_amount}</li>
                ))}
            </ul>

            {/** Create Income */}
            <AddDataFOrm
                onSubmit={handleSubmit}
                onChange={(e) => setIncome(e.target.value)}
                value={income}
            />


        </div>
    )
}
