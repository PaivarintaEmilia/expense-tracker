'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { getItems, createItem, updateItem, deleteItem } from '@/lib/item'
import { getCategories, createCategories } from '@lib/categories'
//import session from '@hooks/session'
import AddDataForm from '@components/AddDataForm'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Filters from '@/components/Filters'
import Listing from '@/components/Listing'
// imports for popup-items
import DeleteItemModal from '@components/modals/DeleteItemModal'
import UpdateItemModal from '@components/modals/UpdateItemModal'
import CreateCategoryModal from '@components/modals/CreateCategoryModal'


/* Types */
type Transactions = {
    amount: number
    description: string
    id: string
    category_id: number
    created_at: number | string
    user_id: number
    type: 'incomes' | 'expenses'
}

type Categories = {
    category_id: number
    category_name: string
}

export default function Home() {

    // Redirecting based onif the user is logged in or not
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) router.replace('/authentication')
        })
    }, [router])

    // States for filtering data
    const [searchCategoryId, setSearchCategoryId] = useState<number | ''>('') // Categories
    const [searchType, setSearchType] = useState<'incomes' | 'expenses'>('expenses') // Item types
    const [startDate, setStartDate] = useState<string>('') // Start date
    const [endDate, setEndDate] = useState<string>('') // End date

    // Creating new data
    const [newAmount, setNewAmount] = useState<string>('')
    const [newDescription, setNewDescription] = useState<string | null>('')

    // Listing all the data
    const [transactionItems, setTransactionItems] = useState<Transactions[]>([])

    // Updating items
    const [itemAmount, setItemAmount] = useState<string>('')
    const [itemDescription, setItemDescription] = useState<string>('')
    const [updateCategoryId, setUpdateCategoryId] = useState<number | ''>('')

    // Categories
    const [categories, setCategories] = useState<Categories[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
    const [newCategory, setNewCategory] = useState<string>('')


    /* UseStates for deletion/update-functionalities*/
    // This might not be useful: const [hoveredId, setHoveredId] = useState<string | null>(null) 
    const [showPopup, setShowPopup] = useState<boolean>(false) // To activate and deactivate the popUp
    const [selectedItem, setSelectedItem] = useState<{ id: string | null, type: 'incomes' | 'expenses' | null }>({ id: null, type: null }) // To get the id and type of the item. Used to pass correct id to delete or updaet functionality

    /** State to tell if Popup should show Delete- or Update-functionality */
    const [popupState, setPopupState] = useState<'delete' | 'update' | 'createCategory' | null>(null);

    /** Closing the popup-items */
    const closePopup = () => {
        setShowPopup(false)
        setPopupState(null)
        setSelectedItem({ id: null, type: null })
        setItemAmount('')
        setItemDescription('')
    }

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

        await updateItem(Number(selectedItem.id), Number(itemAmount), itemDescription, Number(updateCategoryId), String(selectedItem.type))

        allItems()

        setSelectedItem({ id: null, type: null })
        setItemAmount('')
        setItemDescription('')
        setSelectedCategoryId('')
        setShowPopup(false)
        setPopupState(null)

    }

    /** Filter the items by selected filters */

    const filteredItems = useMemo(() => {

        return transactionItems.filter((item) => {
            // Category
            if (typeof searchCategoryId === 'number' && item.category_id !== searchCategoryId) {
                return false
            }

            // Type
            if (item.type !== searchType) {
                return false
            }

            // Selected dates
            if (startDate || endDate) {
                const itemDate = item.created_at
                if (!itemDate) return false // if date is not readable

                if (startDate && itemDate < startDate) return false
                if (endDate && itemDate > endDate) return false
            }

            return true

        });
    }, [transactionItems, searchCategoryId, searchType, startDate, endDate]);

    // Calculate total amount for listed items
    const totalAmount = useMemo(() => {
        return filteredItems.reduce((sum, item) => sum + item.amount, 0)
    }, [filteredItems])

    // Create new category
    const createNewCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(`CreateNewCategory called`)
        await createCategories(String(newCategory))
        setShowPopup(false)
    }

    return (
        <div className="
            flex flex-col items-center gap-15
            ml-[10px] mr-[10px] my-[25px]
            py-[50px]
            "
        >

            <h1 className="text-[35px]">Expense Tracker</h1>

            {/** Filters */}
            <Filters
                categories={categories}
                searchCategoryId={searchCategoryId}
                setSearchCategoryId={setSearchCategoryId}
                searchType={searchType}
                setSearchType={setSearchType}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
            />
            {/** Listing filtered elements */}
            <Listing
                filteredItems={filteredItems}
                totalAmount={totalAmount}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                onRequestDelete={(item) => {
                    setSelectedItem({ id: item.id, type: item.type })
                    setShowPopup(true)
                    setPopupState('delete')
                }}
                onRequestUpdate={(item) => {
                    setSelectedItem({ id: item.id, type: item.type })
                    setShowPopup(true)
                    setPopupState('update')
                    setItemAmount(String(item.amount))
                    setItemDescription(item.description)
                    setUpdateCategoryId(item.category_id)
                }}
            />

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
                        categoriesList={categories}
                        createCategory={(e) => {
                            setShowPopup(true)
                            setPopupState('createCategory')
                        }} />
                </div>
            </div>

            {/* Delete item popup*/}
            <DeleteItemModal
                open={showPopup && popupState === 'delete' && !!selectedItem.id}
                selectedItem={selectedItem}
                onClose={closePopup}
                onConfirm={async () => {
                    try {
                        if (!selectedItem.id || !selectedItem.type) return
                        await deleteItem(Number(selectedItem.id), String(selectedItem.type))
                        await allItems()
                    } finally {
                        closePopup()
                    }
                }}
            />

            {/** Update item popup */}
            <UpdateItemModal
                open={showPopup && popupState === 'update' && !!selectedItem.id}
                onClose={() => {
                    setShowPopup(false)
                    setSelectedItem({ id: null, type: null })
                    setPopupState(null)
                }}
                onSubmit={updateItemF}
                amount={Number(itemAmount)}
                description={itemDescription}
                amountOnChange={(e) => setItemAmount(e.target.value)}
                descriptionOnChange={(e) => setItemDescription(e.target.value)}
                categoryId={updateCategoryId}
                categoryOnChange={(e) => setUpdateCategoryId(parseInt(e.target.value))}
                categoriesList={categories}
            />
            {/** Create category Popup */}
            <CreateCategoryModal
                open={showPopup && popupState === 'createCategory'}
                onClose={closePopup}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                onSubmit={async (e) => {
                    try {
                        await createNewCategory(e)
                        await refreshCategoriesList()
                        setNewCategory('')
                    } finally {
                        closePopup()
                    }
                }}
            />
        </div >
    )
}
// 585 lines



