"use client";
import React, { useState, useEffect } from 'react';

/* Type */
type IncomeAmount = {
    income_amount: number;
}

export default function Home() {

    const [amount, setAmount] = useState<IncomeAmount[]>([]);

    useEffect(() => {
        async function fetchIncome() {
            try {
                const res = await fetch('api/income');
                const data = await res.json();
                setAmount(data);
            } catch (error) {
                console.error('Error while catching data', error);
            }
        }

        fetchIncome();
    }, []);

    console.log(amount);

    return (
        <div>
            <h1>test</h1>
            
            <ul>
                {amount.map((item, index) =>(
                    <li key={index}>{item.income_amount}</li>
                ))}
            </ul>


        </div>
    );
};
