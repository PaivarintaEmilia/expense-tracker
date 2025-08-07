'use client'
import React, { useState, useEffect } from 'react'
import { getIncome, createIncome, updateIncome, deleteIncome } from '@/lib/income'
import session from '@hooks/session'
import AddDataForm from '@components/AddDataForm'
import supabase from '@/lib/supabase'
import UpdateDataForm from '@components/UpdateDataForm'


/* Type */
type IncomeAmount = {
    income_amount: number
    income_description: string
    income_id: string // This should be string or number?
}

export default function Home() {

    //session() --> When home button is pressed automatically changes to authentication page. This should be fixed

    const [amount, setAmount] = useState<IncomeAmount[]>([])
    const [income, setIncome] = useState<number>(0)
    const [description, setDescription] = useState<string>('')

    /* UseStates for deletion-functionalities*/
    const [hoveredId, setHoveredId] = useState<string | null>(null) // Activates the delete-button when user is hovering on top of the list item
    const [showPopup, setShowPopup] = useState<boolean>(false) // To activate and deactivate the popUp
    const [selectedId, setSelectedId] = useState<string | null>(null) // To get the id of the item that is passed to deleteIncome-function

    /** State to tell if Popup should show Delete- or Update-functionality */
    const [popupState, setPopupState] = useState<'delete' | 'update' | null>(null);

    const refreshIncomeList = async () => {
        const updatedData = await getIncome()
        console.log("getIncomeData: ", updatedData)
        setAmount(updatedData)
    }

    useEffect(() => {
        refreshIncomeList()
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

        refreshIncomeList()

        setIncome(0)

    }

    /** Update Income */
    const updateIncomeF = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() 

        console.log("update info: ", selectedId, income, description)

        await updateIncome(Number(selectedId), income, description)

        await refreshIncomeList() 
        setShowPopup(false)
        setSelectedId(null)
        setPopupState(null)
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
                        {item.income_amount}{item.income_description}

                        {hoveredId === item.income_id && (
                            <div>
                                <button
                                    onClick={() => {
                                        setSelectedId(item.income_id)
                                        setShowPopup(true)
                                        setPopupState('delete')
                                    }}
                                >Delete</button>

                                <button
                                    onClick={() => {
                                        setSelectedId(item.income_id)
                                        setShowPopup(true)
                                        setPopupState('update')
                                        setIncome(item.income_amount)
                                        setDescription(item.income_description)
                                    }}
                                >Update</button>
                            </div>

                        )}
                    </li>
                ))}
            </ul>

            {/** Create Income */}
            <AddDataForm
                onSubmit={handleSubmit}
                amountOnChange={(e) => setIncome(Number(e.target.value))}
                descriptionOnChange={(e) => setDescription(e.target.value)}
                amount={income}
                description={description}
            />

            {/* Popup */}

            {/* When showPopup is true and selectedId is set --> show the popup*/}
            {showPopup && selectedId && popupState === 'delete' && (
                <div>
                    <p>Do you want to delete the item {selectedId}?</p>
                    <div>
                        <button
                            onClick={ async () => {
                                await deleteIncome(Number(selectedId))
                                await refreshIncomeList()
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

            )}

            {showPopup && selectedId && popupState === 'update' && (
                <UpdateDataForm

                    onSubmit={updateIncomeF}
                    amountOnChange={(e) => setIncome(Number(e.target.value))}
                    descriptionOnChange={(e) => setDescription(e.target.value)}
                    cancelFunction={() => {
                        setShowPopup(false)
                        setSelectedId(null)
                        setPopupState(null)
                    }}
                    amount={income}
                    description={description}
                // Should we also add IncomeId here?
                ></UpdateDataForm>
            )}



        </div>
    )
}




