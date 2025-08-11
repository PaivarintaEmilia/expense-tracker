'use client'
import React, { useState, useEffect } from 'react'
import { getIncome, createIncome, updateIncome, deleteIncome } from '@/lib/income'
import { getExpenses, createExpense, updateExpense } from '@/lib/expense'
import session from '@hooks/session'
import AddDataForm from '@components/AddDataForm'
import supabase from '@/lib/supabase'
import UpdateDataForm from '@components/UpdateDataForm'


/* Type */
type Incomes = {
    income_amount: number
    income_description: string
    income_id: string // This should be string or number?
}

type Expenses = {
    expense_amount: number
    expense_description: string
    expense_id: string
}

export default function Home() {

    //session() --> When home button is pressed automatically changes to authentication page. This should be fixed

    const [incomes, setIncomes] = useState<Incomes[]>([])
    const [incomeAmount, setIncomeAmount] = useState<number>(0)
    const [incomeDescription, setIncomeDescription] = useState<string>('')

    const [expenses, setExpenses] = useState<Expenses[]>([])
    const [expenseAmount, setExpenseAmount] = useState<number>(0)
    const [expenseDescription, setExpenseDescription] = useState<string>('')

    /* UseStates for deletion-functionalities*/
    const [hoveredId, setHoveredId] = useState<string | null>(null) // Activates the delete-button when user is hovering on top of the list item
    const [showPopup, setShowPopup] = useState<boolean>(false) // To activate and deactivate the popUp
    const [selectedId, setSelectedId] = useState<string | null>(null) // To get the id of the item that is passed to deleteIncome-function

    /** State to tell if Popup should show Delete- or Update-functionality */
    const [popupState, setPopupState] = useState<'delete' | 'update' | null>(null);

    /** Get userId */
    const getUserId = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        console.log('User ID: ', user?.id)

        // Check if the user is underfined becuause getUser returns string or undefined
        if (!user || !user.id) {
            throw new Error('User is not authenticated')
        }

        return user
    }


    /* Get Incomes */
    const refreshIncomeList = async () => {
        const updatedData = await getIncome()
        console.log("getIncomeData: ", updatedData)
        setIncomes(updatedData)
    }

    /* Get Expenses */
    const refreshExpenseList = async () => {
        const updatedData = await getExpenses()
        setExpenses(updatedData)
    }

    useEffect(() => {
        refreshIncomeList()
        refreshExpenseList()
    }, [])

    /* Creat new Income*/
    const createNewIncome = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const user = await getUserId()

        const userId = user?.id

        const date = new Date();

        createIncome(userId, incomeAmount, date, incomeDescription)

        refreshIncomeList()
        setIncomeAmount(0)
        setIncomeDescription('')
    }

    /** Create new expense */
    const creatingNewExpense = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const date = new Date();

        const user = await getUserId()

        const userId = user?.id

        console.log("userID", userId)
        console.log("examount", expenseAmount)
        console.log("exdate", date)
        console.log("exdesc", expenseDescription)

        createExpense(userId, expenseAmount, date, expenseDescription)

        refreshExpenseList()
        setExpenseAmount(0)
        setExpenseDescription('')

    }

    /** Update Income */
    const updateIncomeF = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log("update info: ", selectedId, incomeAmount, incomeDescription)

        await updateIncome(Number(selectedId), incomeAmount, incomeDescription)

        await refreshIncomeList()
        setShowPopup(false)
        setSelectedId(null)
        setPopupState(null)
    }

    /** Update Expense */
    const updateExpenseF = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log("Update expense info: ", selectedId, expenseAmount, expenseDescription)

        await updateExpense(Number(selectedId), expenseAmount, expenseDescription)

        await refreshExpenseList()
        setShowPopup(false)
        setSelectedId(null)
        setPopupState(null)

    }

    return (
        <div className="flex flex-col items-center">

            <h1>Expense Tracker</h1>
            <div className=""> 
                {/* List of Incomes */}
                <div className="">
                    <h2>Incomes</h2>
                    <ul>
                        {incomes.map((item, index) => (
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
                                                setIncomeAmount(item.income_amount)
                                                setIncomeDescription(item.income_description)
                                            }}
                                        >Update</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>


                { /** List of expenses */}
                <div className="">
                    <h2>Expenses</h2>
                    <ul>
                        {expenses.map((item, index) => (
                            <li
                                key={index}
                                onMouseEnter={() => setHoveredId(item.expense_id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {item.expense_amount}{item.expense_description}

                                {hoveredId === item.expense_id && (
                                    <div>
                                        <button
                                            onClick={() => {
                                                setSelectedId(item.expense_id)
                                                setShowPopup(true)
                                                setPopupState('delete')
                                            }}
                                        >Delete</button>

                                        <button
                                            onClick={() => {
                                                setSelectedId(item.expense_id)
                                                setShowPopup(true)
                                                setPopupState('update')
                                                setIncomeAmount(item.expense_amount)
                                                setIncomeDescription(item.expense_description)
                                            }}
                                        >Update</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


            {/** Create Income */}
            <h2>Create a new income</h2>
            <AddDataForm
                onSubmit={createNewIncome}
                amountOnChange={(e) => setIncomeAmount(Number(e.target.value))}
                descriptionOnChange={(e) => setIncomeDescription(e.target.value)}
                amount={incomeAmount}
                description={incomeDescription}
            />

            {/** Create Expense */}
            <h2>Create a new Expense</h2>
            <AddDataForm
                onSubmit={creatingNewExpense}
                amountOnChange={(e) => setExpenseAmount(Number(e.target.value))}
                descriptionOnChange={(e) => setExpenseDescription(e.target.value)}
                amount={expenseAmount}
                description={expenseDescription}
            />

            {/* Popup */}

            {/* When showPopup is true and selectedId is set --> show the popup*/}
            {showPopup && selectedId && popupState === 'delete' && (
                <div>
                    <p>Do you want to delete the item {selectedId}?</p>
                    <div>
                        <button
                            onClick={async () => {
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

                    onSubmit={updateExpenseF} 
                    amountOnChange={(e) => setExpenseAmount(Number(e.target.value))} 
                    descriptionOnChange={(e) => setExpenseDescription(e.target.value)} 
                    cancelFunction={() => {
                        setShowPopup(false)
                        setSelectedId(null)
                        setPopupState(null)
                    }}
                    amount={expenseAmount} 
                    description={expenseDescription}
                // Should we also add ExpenseId here?
                ></UpdateDataForm>
            )}



        </div>
    )
}




