'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { getItems, createItem, updateItem, deleteItem } from '@/lib/items'
import { getCategories, createCategories } from '@lib/categories'
import AddDataForm from '@components/AddDataForm'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Filters from '@/components/Filters'
import Listing from '@/components/Listing'
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
    user_id: string
    type: 'incomes' | 'expenses'
}

type Categories = {
    category_id: number
    category_name: string
}

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) router.replace('/authentication')
        })
    }, [router])

    // States for filtering data
    const [searchCategoryId, setSearchCategoryId] = useState<number | ''>('') // Categories
    const [searchType, setSearchType] = useState<'incomes' | 'expenses' | 'all'>(
        'all',
    ) // Item types
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
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>(
        '',
    )
    const [newCategory, setNewCategory] = useState<string>('')

    /* UseStates for deletion/update-functionalities*/
    const [showPopup, setShowPopup] = useState<boolean>(false) // To activate and deactivate the popUp
    const [selectedItem, setSelectedItem] = useState<{
        id: string | null
        type: 'incomes' | 'expenses' | null
    }>({ id: null, type: null }) // To get the id and type of the item. Used to pass correct id to delete or updaet functionality

    /** State to tell if Popup should show Delete- or Update-functionality */
    const [popupState, setPopupState] = useState<
        'delete' | 'update' | 'createCategory' | null
    >(null)

    /** Closing the popup-items */
    const closePopup = () => {
        setShowPopup(false)
        setPopupState(null)
        setSelectedItem({ id: null, type: null })
        setItemAmount('')
        setItemDescription('')
    }

    /* Get all the data for the listing*/
    const getAllItems = async () => {

        const user = await getUserId()
        const userId = user?.id

        const allItems = await getItems(userId)
        console.log(
            'Data when fetching all the items fron items.ts : ',
            allItems,
        )
        console.log(
            'Data when fetching all the items first object, type : ',
            allItems[0].type,
        )
        setTransactionItems(allItems)
    }

    /** Get userId */
    const getUserId = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()
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
        getAllItems()
    }, [])

    /** Create new item */
    const creatingItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Get the radio-input fields value
        const formObject = new FormData(e.currentTarget)
        console.log('Type from radio while creating new item: ', formObject)
        const type = formObject.get('item_type')

        const date = new Date()

        const user = await getUserId()
        const userId = user?.id

        await createItem(
            userId,
            Number(newAmount),
            String(newDescription),
            date,
            Number(selectedCategoryId),
            String(type),
        )

        await getAllItems()
        setNewAmount('')
        setNewDescription('')
        setSelectedCategoryId('')
    }

    /** Update item */
    const updateItemF = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log('Data of item to be updated: ')

        await updateItem(
            Number(selectedItem.id),
            Number(itemAmount),
            itemDescription,
            Number(updateCategoryId),
            String(selectedItem.type),
        )

        await getAllItems()

        setSelectedItem({ id: null, type: null })
        setItemAmount('')
        setItemDescription('')
        setSelectedCategoryId('')
        setShowPopup(false)
        setPopupState(null)
    }

    // Create new category
    const createNewCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(`CreateNewCategory called`)
        await createCategories(String(newCategory))
        setShowPopup(false)
    }


    /** Filter the items by selected filters */

    const filteredItems = useMemo(() => {
        return transactionItems.filter((item) => {
            
            // Filtering based on the selected category            
            if (searchCategoryId !== '' && item.category_id !== searchCategoryId) {
                return false
            }

            // Filtering based on the selected type
            if (searchType !== 'all' && item.type !== searchType) {
                return false
            }

            // Filtering based on the selected dates
            if (startDate || endDate) {
                const itemDate = item.created_at
                if (!itemDate) return false // if date is not readable

                if (startDate && itemDate < startDate) return false
                if (endDate && itemDate > endDate) return false
            }

            return true
        })
    }, [transactionItems, searchCategoryId, searchType, startDate, endDate])

    // Calculate total amount for listed items
    const totalAmount = useMemo(() => {
        return filteredItems.reduce((sum, item) => sum + item.amount, 0)
    }, [filteredItems])


    return (
        <div
            className='
            flex flex-col items-center gap-15
            ml-2.5 mr-2.5 my-6.25
            py-12.5
            '
        >
            <h1 className='text-[35px]'>Expense Tracker</h1>

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

            <div
                className='
                    w-full
                    flex flex-col gap-20 justify-center items-center
                    mb-25
                    lg:flex-row
                    '
            >
                <div className='w-90'>
                    <h2 className='text-[20px] w-full text-center'>
                        Create a new Item
                    </h2>
                    <AddDataForm
                        onSubmit={creatingItem}
                        amountOnChange={(e) => setNewAmount(e.target.value)}
                        descriptionOnChange={(e) =>
                            setNewDescription(e.target.value)
                        }
                        amount={newAmount}
                        description={String(newDescription)}
                        selectedCategoryOnChange={(e) => {
                            const value = parseInt(e.target.value)
                            setSelectedCategoryId(value)
                        }}
                        categoryId={selectedCategoryId}
                        categoriesList={categories}
                        createCategory={() => {
                            setShowPopup(true)
                            setPopupState('createCategory')
                        }}
                    />
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
                        await deleteItem(
                            Number(selectedItem.id),
                            String(selectedItem.type),
                        )
                        await getAllItems()
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
                categoryOnChange={(e) =>
                    setUpdateCategoryId(parseInt(e.target.value))
                }
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
        </div>
    )
}

