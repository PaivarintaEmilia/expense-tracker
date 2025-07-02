'use client'
import React, { useState, useEffect } from 'react'
import { getIncome, createIncome, deleteIncome } from '@/lib/income'
import session from '@hooks/session'
import AddDataFOrm from '@components/AddDataForm'
import supabase from '@/lib/supabase'


/* Type */
type IncomeAmount = {
    income_amount: number
    income_description: string
    income_id: string // This should be string or number?
}

export default function Home() {

    session()

    const [amount, setAmount] = useState<IncomeAmount[]>([])
    const [income, setIncome] = useState<number>(0)
    const [description, setDescription] = useState<string>('')

    /* UseStates for deletion-functionalities*/
    const [hoveredId, setHoveredId] = useState<string | null>(null) // Activates the delete-button when user is hovering on top of the list item
    const [showPopup, setShowPopup] = useState<boolean>(false) // To activate and deactivate the popUp
    const [selectedId, setSelectedId] = useState<string | null>(null) // To get the id of the item that is passed to deleteIncome-function

    useEffect(() => {
        async function fetchIncome() {
            const incomeData = await getIncome()
            console.log("getIncomeData: ", incomeData)
            setAmount(incomeData)
        }
        fetchIncome()
    }, [])

    /* Creat new Income*/
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { data: { user } } = await supabase.auth.getUser()
        console.log('User ID: ', user?.id)

        // Check if the user is underfined becuause getUser returns string or undefined
        if (!user || !user.id) {
            throw new Error('User is not authenticated')
        }

        const userId = user?.id

        const date = new Date();

        console.log('userId: ', userId)
        console.log('Income: ', income)
        console.log('Date: ', date)
        console.log('Description: ', description)

        createIncome(userId, income, date, description)

        const updatedData = await getIncome() //  Update the listed income data shown on the page
        setAmount(updatedData)

        setIncome(0)

    }

    return (
        <div className="">
            <h1>test</h1>
            <ul>
                {amount.map((item, index) => (
                    <li
                        key={index}
                        onMouseEnter={() => setHoveredId(item.income_id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {item.income_amount}

                        {hoveredId === item.income_id && (
                            <button
                                onClick={() => {
                                    setSelectedId(item.income_id)
                                    setShowPopup(true)
                                }}
                            >Delete</button>
                        )}
                    </li>
                ))}
            </ul>

            {/** Create Income */}
            <AddDataFOrm
                onSubmit={handleSubmit}
                amountOnChange={(e) => setIncome(Number(e.target.value))}
                descriptionOnChange={(e) => setDescription(e.target.value)}
                amount={income}
                description={description}
            />


        </div>
    )

    /* Popup */

    // When showPopup is true and selectedId is set --> show the popup
    {
        showPopup && selectedId && (
            <div>
                <p>Do you want to delete the item {selectedId}?</p>
                <div>
                    <button
                        onClick={() => {
                            deleteIncome(selectedId)
                            console.log('Income item deleted')
                            setShowPopup(false)
                            setSelectedId(null)
                        }}
                    >Yes</button>
                    <button
                        onClick={() => {
                            setShowPopup(false)
                            setSelectedId(null)
                        }}
                    >Cancel</button>
                </div>
            </div>
        )
    }

}




