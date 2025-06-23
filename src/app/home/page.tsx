'use client'
import React, { useState, useEffect } from 'react'
import { getIncome } from '@/lib/income'

/* Type */
type IncomeAmount = {
    income_amount: number
}

export default function Home() {

    const [amount, setAmount] = useState<IncomeAmount[]>([])

    useEffect(() => {
        async function fetchIncome() {
            const amountData = await getIncome()
            console.log("getIncomeData: ", amountData)
            setAmount(amountData)
        }
        fetchIncome()
    }, [])

    console.log("2. Amount: ", amount)

    return (
        <div className="">
            <h1>test</h1>
            <ul>
                {amount.map((item, index) =>(
                    <li key={index}>{item.income_amount}</li>
                ))}
            </ul>
        </div>
    )
}
