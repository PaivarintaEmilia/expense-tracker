'use client'
import React, { useState, useEffect } from 'react'
import { getIncome, createIncome, updateIncome, deleteIncome } from '@/lib/income'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '@/lib/expense'
//import session from '@hooks/session'
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

    /* UseStates for deletion/update-functionalities*/
    const [hoveredId, setHoveredId] = useState<string | null>(null) // Activates the delete-button when user is hovering on top of the list item
    const [showPopup, setShowPopup] = useState<boolean>(false) // To activate and deactivate the popUp
    const [selectedItem, setSelectedItem] = useState<{ id: string | null, type: 'income' | 'expense' | null }>({ id: null, type: null }) // To get the id and type of the item. Used to pass correct id to delete or updaet functionality

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

        console.log("update info: ", selectedItem.id, incomeAmount, incomeDescription)

        await updateIncome(Number(selectedItem.id), incomeAmount, incomeDescription)

        await refreshIncomeList()
        setShowPopup(false)
        setSelectedItem({ id: null, type: null })
        setPopupState(null)
    }

    /** Update Expense */
    const updateExpenseF = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log("Update expense info: ", selectedItem, expenseAmount, expenseDescription)

        await updateExpense(Number(selectedItem), expenseAmount, expenseDescription)

        await refreshExpenseList()
        setShowPopup(false)
        setSelectedItem({ id: null, type: null })
        setPopupState(null)

    }

    return (
        <div className="
            flex flex-col items-center gap-15
            ml-[10px] mr-[10px] my-[25px]
            py-[50px]
            "
        >

            <h1 className="text-[35px]">Expense Tracker</h1>
            {/** Lists of the items */}
            <div className="
                w-full
                flex flex-col gap-12 justify-center
                my-[35px]
                px-[30px]
                lg:flex-row 
                "
            >
                {/* List of Incomes */}
                <div className="
                    border border-stone-700 rounded-md
                    px-[40px] py-[35px]
                    flex flex-col gap-5
                    "
                >
                    <h2 className="text-[20px]">Incomes</h2>
                    <ul>
                        {incomes.map((item, index) => (
                            <li
                                className="
                                    cursor-pointer
                                    py-[8px]
                                    text-[15px]    
                                "
                                key={index}
                                onMouseEnter={() => setHoveredId(item.income_id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {item.income_amount} € {item.income_description}

                                {/** Delete and update buttons for items */}
                                {hoveredId === item.income_id && (
                                    <div className="
                                        py-[8px]
                                        flex flex-row gap-5
                                        "
                                    >
                                        <button
                                            className="
                                                cursor-pointer
                                                transition
                                                hover:text-sky-300
                                            "
                                            onClick={() => {
                                                setSelectedItem({ id: item.income_id, type: 'income' })
                                                setShowPopup(true)
                                                setPopupState('delete')
                                            }}
                                        >Delete</button>

                                        <button
                                            className="
                                                cursor-pointer
                                                transition
                                                hover:text-sky-300
                                            "
                                            onClick={() => {
                                                setSelectedItem({ id: item.income_id, type: 'income' })
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
                <div className="
                    border border-stone-700 rounded-md
                    px-[40px] py-[35px]
                    flex flex-col gap-5
                    "
                >
                    <h2 className="text-[20px]">Expenses</h2>
                    <ul>
                        {expenses.map((item, index) => (
                            <li
                                className="
                                    cursor-pointer
                                    py-[8px]
                                    text-[15px]
                                "
                                key={index}
                                onMouseEnter={() => setHoveredId(item.expense_id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {item.expense_amount} € {item.expense_description}

                                {hoveredId === item.expense_id && (
                                    <div className="
                                        py-[8px]
                                        flex flex-row gap-5
                                        "
                                    >
                                        <button
                                            className="
                                                cursor-pointer
                                                transition
                                                hover:text-sky-300
                                            "
                                            onClick={() => {
                                                setSelectedItem({ id: item.expense_id, type: 'expense' })
                                                setShowPopup(true)
                                                setPopupState('delete')
                                            }}
                                        >Delete</button>

                                        <button
                                            className="
                                                cursor-pointer
                                                transition
                                                hover:text-sky-300
                                            "
                                            onClick={() => {
                                                setSelectedItem({ id: item.expense_id, type: 'expense' })
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

            {/** Create items forms */}

            <div className="
                w-full
                flex flex-col gap-20 justify-center items-center
                mb-[100px]
                lg:flex-row
                "
            >
                {/** Create Income */}
                <div className="w-90">
                    <h2 className="text-[20px] w-full text-center">Create a new income</h2>
                    <AddDataForm
                        onSubmit={createNewIncome}
                        amountOnChange={(e) => setIncomeAmount(Number(e.target.value))}
                        descriptionOnChange={(e) => setIncomeDescription(e.target.value)}
                        amount={incomeAmount}
                        description={incomeDescription}
                    />
                </div>


                {/** Create Expense */}
                <div className="w-90">
                    <h2 className="text-[20px] w-full text-center">Create a new Expense</h2>
                    <AddDataForm
                        onSubmit={creatingNewExpense}
                        amountOnChange={(e) => setExpenseAmount(Number(e.target.value))}
                        descriptionOnChange={(e) => setExpenseDescription(e.target.value)}
                        amount={expenseAmount}
                        description={expenseDescription}
                    />
                </div>

            </div>




            {/* Popup */}

            {/* When showPopup is true and selectedId is set --> show the popup*/}
            {showPopup && selectedItem && popupState === 'delete' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/** Background of the page while Popup (is covering popup at the moment) */}
                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={() => {
                            setShowPopup(false)
                            setSelectedItem({ id: null, type: null })
                        }}
                    ></div>

                    {/** Popup card delete */}
                    <div
                        role="dialog"
                        arial-modal="true"
                        className="
                            relative z-10 bg-stone-800
                            border border-sky-300 rounded-md
                            w-[92vw] max-w-[360px] md:max-w-[520px] lg:max-w-[640px]
                            max-h-[85vh] overflow-y-auto
                            p-6 md:p-7 lg:p-8 shadow-lg
                        "
                    >
                        <p className="text-[16px] md:text-[18px] w-full text-center">Do you want to delete the item {selectedItem.id}?</p>
                        <div className="mt-6 flex justify-center gap-5">
                            <button
                                className="             
                                    inline-flex items-center
                                    text-[18px] font-normal
                                    mt-2
                                    cursor-pointer
                                "
                                onClick={async () => {
                                    if (selectedItem.type === 'income') {
                                        await deleteIncome(Number(selectedItem.id))
                                        await refreshIncomeList()
                                        console.log('Income item deleted')

                                    } else if (selectedItem.type === 'expense') {
                                        await deleteExpense(Number(selectedItem.id))
                                        await refreshExpenseList()
                                        console.log('Expense item deleted')

                                    }

                                    setShowPopup(false)
                                    setSelectedItem({ id: null, type: null })
                                }}
                            >Yes</button>
                            <button
                                className="
                                    mt-2
                                    inline-flex items-center justify-center
                                    rounded-md
                                    border border-sky-300
                                    px-4 py-2
                                    text-[15px] font-bold
                                    text-white-900
                                    transition
                                    hover:bg-stone-700 hover:shadow 
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200
                                    active:translate-y-[1px]
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    cursor-pointer
                                "
                                onClick={() => {
                                    setShowPopup(false)
                                    setSelectedItem({ id: null, type: null })
                                }}
                            >Cancel</button>
                        </div>


                    </div>

                </div>

            )}

            {showPopup && selectedItem.id && popupState === 'update' && (

                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/** Darker background */}
                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={() => {
                            setShowPopup(false)
                            setSelectedItem({ id: null, type: null })
                        }}
                    ></div>

                    {/** Popup card for updating items */}
                    <div
                        role="dialog"
                        arial-modal="true"
                        className="
                            relative z-10 bg-stone-800
                            border border-sky-300 rounded-md
                            w-[92vw] max-w-[360px] md:max-w-[520px] lg:max-w-[640px]
                            max-h-[85vh] overflow-y-auto
                            p-6 md:p-7 lg:p-8 shadow-lg
                        "
                    >

                        {selectedItem.type === 'income' ? (
                            <UpdateDataForm
                                onSubmit={updateIncomeF}
                                amountOnChange={(e) => setIncomeAmount(Number(e.target.value))}
                                descriptionOnChange={(e) => setIncomeDescription(e.target.value)}
                                cancelFunction={() => {
                                    setShowPopup(false)
                                    setSelectedItem({ id: null, type: null })
                                    setPopupState(null)
                                }}
                                amount={incomeAmount}
                                description={incomeDescription}
                            // Should we also add IncomeId here?
                            ></UpdateDataForm>
                        ) : (
                            <UpdateDataForm
                                onSubmit={updateExpenseF}
                                amountOnChange={(e) => setExpenseAmount(Number(e.target.value))}
                                descriptionOnChange={(e) => setExpenseDescription(e.target.value)}
                                cancelFunction={() => {
                                    setShowPopup(false)
                                    setSelectedItem({ id: null, type: null })
                                    setPopupState(null)
                                }}
                                amount={expenseAmount}
                                description={expenseDescription}
                            // Should we also add ExpenseId here?
                            ></UpdateDataForm>
                        )}
                    </div>
                </div>
            )}
        </div >
    )
}




