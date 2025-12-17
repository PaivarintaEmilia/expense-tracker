'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { getItems, createItem, updateItem, deleteItem } from '@/lib/item'
import { getCategories } from '@lib/categories'
//import session from '@hooks/session'
import AddDataForm from '@components/AddDataForm'
import supabase from '@/lib/supabase'
import UpdateDataForm from '@components/UpdateDataForm'


/* Types */
type Transactions = {
    amount: number
    description: string
    id: string
    category_id: number
    created_at: number
    user_id: number
    type: 'incomes' | 'expenses'
}

type Categories = {
    category_id: number
    category_name: string
}

export default function Home() {

    //session() --> When home button is pressed automatically changes to authentication page. This should be fixed

    // Creating new data
    const [newAmount, setNewAmount] = useState<string>('')
    const [newDescription, setNewDescription] = useState<string | null>('')

    // Listing all the data
    const [transactionItems, setTransactionItems] = useState<Transactions[]>([])

    // Updatting items
    const [itemAmount, setItemAmount] = useState<string>('')
    const [itemDescription, setItemDescription] = useState<string>('')

    // Categories
    const [categories, setCategories] = useState<Categories[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');


    /* UseStates for deletion/update-functionalities*/
    // This might not be useful: const [hoveredId, setHoveredId] = useState<string | null>(null) 
    const [showPopup, setShowPopup] = useState<boolean>(false) // To activate and deactivate the popUp
    const [selectedItem, setSelectedItem] = useState<{ id: string | null, type: 'incomes' | 'expenses' | null }>({ id: null, type: null }) // To get the id and type of the item. Used to pass correct id to delete or updaet functionality

    /** State to tell if Popup should show Delete- or Update-functionality */
    const [popupState, setPopupState] = useState<'delete' | 'update' | null>(null);


    /* Test for getting all the items for listing*/

    const allItems = async () => {
        const allitems = await getItems()
        console.log("Data when fetching all the items fron items.ts : ", allitems)
        console.log("Data when fetching all the items first object, type : ", allitems[0].type)
        setTransactionItems(allitems)
    }

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

    /* Get categories */
    const refreshCategoriesList = async () => {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
    }

    useEffect(() => {
        refreshCategoriesList()
        allItems()
    }, [])



    /** Create new item */
    const creatingItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Get the radio-input fields value
        const formObject = new FormData(e.currentTarget)
        console.log("Type from radio while creating new item: ", formObject)
        const type = formObject.get('item_type')

        const date = new Date()

        const user = await getUserId()
        const userId = user?.id

        console.log("Create item userID", userId)
        console.log("Create item amount", newAmount)
        console.log("Create item date", date)
        console.log("Create item desc", newDescription)
        console.log("Create item category id", selectedCategoryId)
        console.log("Create item type", type)

        await createItem(userId, Number(newAmount), String(newDescription), date, Number(selectedCategoryId), String(type))

        allItems()
        setNewAmount('')
        setNewDescription('')
        setSelectedCategoryId('')

    }

    /** Update item */
    const updateItemF = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log("Data of item to be updated: ")

        await updateItem(Number(selectedItem.id), Number(itemAmount), itemDescription, Number(selectedCategoryId), String(selectedItem.type))

        allItems()

        setSelectedItem({ id: null, type: null })
        setItemAmount('')
        setItemDescription('')
        setSelectedCategoryId('')
        setShowPopup(false)
        setPopupState(null)

    }

    /** Filter the items by categories */

    const filteredItems = useMemo(() => {
        if (typeof selectedCategoryId !== 'number') return [];
        return transactionItems.filter((e) => e.category_id === selectedCategoryId);
    }, [transactionItems, selectedCategoryId]);

    return (
        <div className="
            flex flex-col items-center gap-15
            ml-[10px] mr-[10px] my-[25px]
            py-[50px]
            "
        >

            <h1 className="text-[35px]">Expense Tracker</h1>

            {/** Filters: categories... */}

            <div className="border border-lime-400 w-full flex flex-col justify-center items-center">

                <h2 className="text-[23px] mb-[35px]">Categories</h2>

                <form className="w-[300px] mb-[35px]">
                    <label>Category</label>
                    <select
                        className="
                            w-full
                            border border-neutral-600
                            rounded-md
                            px-3 py-2
                            text-gray-200 font-light
                            outline-none
                            hover:border-gray-400
                            focus:border-sky-200 focus:ring-0.5 focus:ring-sky-200
                        "
                        onChange={(e) => {
                            const value = parseInt(e.target.value)
                            setSelectedCategoryId(value)
                        }}
                        value={selectedCategoryId}
                    >
                        <option value="">Select category</option>
                        {categories.map(option => (
                            <option key={option.category_id} value={option.category_id}>
                                {option.category_name}
                            </option>
                        ))}
                    </select>

                    {/** Select type incomes or expenses */}
                    <fieldset>
                        <legend>Select the type:</legend>
                        <div>
                            <label htmlFor="income">
                                <input type="radio" id="income" name="item_type" value="incomes" defaultChecked />
                                <span>Income</span>
                            </label>
                            <label htmlFor="expense">
                                <input type="radio" id="expense" name="item_type" value="expenses" />
                                <span>Expense</span>
                            </label>
                        </div>
                    </fieldset>
                </form>

                <p>Selected Category id: {selectedCategoryId}</p>

                {filteredItems.length === 0 ? (
                    <p>No items found. Try to change filters.</p>
                ) : (
                    <div className="
                        w-full
                        flex flex-col gap-12 justify-center
                        my-[35px]
                        px-[30px]
                        lg:flex-row"
                    >
                        {/** List of items */}
                        <div className="
                            border border-stone-700 rounded-md
                            px-[40px] py-[35px]
                            flex flex-col gap-5"
                        >
                            <h2 className="text-[20px]">All items</h2>
                            <ul>
                                {filteredItems.map((item, index) => (
                                    <li className="
                                        cursor-pointer
                                        py-[8px]
                                        text-[15px]"
                                        key={index}
                                        onMouseEnter={() => setSelectedItem({ id: item.id, type: item.type })}
                                        onMouseLeave={() => { }}
                                    >
                                        {item.amount}€, {item.description}, {item.type}, {item.category_id}

                                        {/** Delete and update buttons for items */}
                                        {selectedItem.id === item.id && selectedItem.type === item.type && (
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
                                                        setSelectedItem({ id: item.id, type: item.type })  // is this necessary as it's already stated
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
                                                        setSelectedItem({ id: item.id, type: item.type })
                                                        setShowPopup(true)
                                                        setPopupState('update')
                                                        setItemAmount(String(item.amount))
                                                        setItemDescription(item.description)
                                                    }}
                                                >Update</button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <p>
                                Total amount of selected items: {filteredItems.reduce((sum, item) => sum + item.amount, 0)} €
                            </p>
                        </div>
                    </div>
                )}

            </div>




            {/** Create items forms */}

            <div className="
                    w-full
                    flex flex-col gap-20 justify-center items-center
                    mb-[100px]
                    lg:flex-row
                    "
            >
                <div className="w-90">
                    <h2 className="text-[20px] w-full text-center">Create a new Item</h2>
                    <AddDataForm
                        onSubmit={creatingItem}
                        amountOnChange={(e) => setNewAmount(e.target.value)}
                        descriptionOnChange={(e) => setNewDescription(e.target.value)}
                        amount={newAmount}
                        description={String(newDescription)}
                        selectedCategoryOnChange={(e) => {
                            const value = parseInt(e.target.value)
                            setSelectedCategoryId(value)
                        }}
                        categoryId={selectedCategoryId}
                        categoriesList={categories} />
                </div>

            </div>





            {/* Popup */}

            {/* When showPopup is true and selectedId is set --> show the popup*/}
            {
                showPopup && selectedItem && popupState === 'delete' && (
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
                            aria-modal="true"
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
                                        await deleteItem(Number(selectedItem.id), String(selectedItem.type))
                                        allItems() // Is this needed. Is the page reloaded after deletion?
                                        console.log('Item deleted.')
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

                )
            }
            {/** Update item popup */}
            {
                showPopup && selectedItem.id && popupState === 'update' && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/** Darker background */}
                        <div
                            className="absolute inset-0 bg-black/70"
                            onClick={() => {
                                setShowPopup(false)
                                setSelectedItem({ id: null, type: null })
                                setItemAmount('')
                                setItemDescription('')
                            }}
                        ></div>

                        {/** Popup card for updating items */}
                        <div
                            role="dialog"
                            aria-modal="true"
                            className="
                                relative z-10 bg-stone-800
                                border border-sky-300 rounded-md
                                w-[92vw] max-w-[360px] md:max-w-[520px] lg:max-w-[640px]
                                max-h-[85vh] overflow-y-auto
                                p-6 md:p-7 lg:p-8 shadow-lg
                            "
                        >
                            <UpdateDataForm
                                onSubmit={updateItemF}
                                amountOnChange={(e) => setItemAmount(e.target.value)}
                                descriptionOnChange={(e) => setItemDescription(e.target.value)}
                                cancelFunction={() => {
                                    setShowPopup(false)
                                    setSelectedItem({ id: null, type: null })
                                    setPopupState(null)
                                }}
                                amount={Number(itemAmount)}
                                description={itemDescription}
                                categoryOnChange={(e) => {
                                    const value = parseInt(e.target.value)
                                    setSelectedCategoryId(value)
                                }}
                                categoryId={selectedCategoryId}
                                categoriesList={categories}                        >
                            </UpdateDataForm>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
// 452 lines
// 509 lines



