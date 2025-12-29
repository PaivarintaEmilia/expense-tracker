type ItemType = 'incomes' | 'expenses'

export type ListingItem = {
  id: string
  amount: number
  description: string
  type: ItemType
  category_id: number
}

type SelectedItem = {
  id: string | null
  type: ItemType | null
}

type ListingProps = {
  filteredItems: ListingItem[]
  totalAmount: number

  selectedItem: SelectedItem
  setSelectedItem: React.Dispatch<React.SetStateAction<SelectedItem>>

  onRequestDelete: (item: ListingItem) => void
  onRequestUpdate: (item: ListingItem) => void
}


export default function Listing(
    {
        filteredItems,
        totalAmount,
        selectedItem,
        setSelectedItem,
        onRequestDelete,
        onRequestUpdate,
    }: ListingProps
) {
    return (
        <div className="w-full flex flex-col justify-center items-center">

            {/** List of items */}
            {filteredItems.length === 0 ? (
                <p>No items found. Try to change filters.</p>
            ) : (
                <div className="
                        w-full
                        flex flex-col gap-12 justify-center
                        px-[30px]
                        lg:flex-row"
                >

                    <div className="
                            border border-stone-700 rounded-md
                            px-[40px] py-[35px]
                            flex flex-col gap-5"
                    >
                        <h2 className="text-[20px]">Items</h2>
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
                                                onClick={() => onRequestDelete(item)}
                                                type="button"
                                            >Delete</button>

                                            <button
                                                className="
                                                                cursor-pointer
                                                                transition
                                                                hover:text-sky-300
                                                            "
                                                onClick={() => onRequestUpdate(item)}
                                                type="button"
                                            >Update</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <p>
                            Total amount of selected items: {totalAmount} €
                        </p>
                    </div>
                </div>
            )}

        </div>
    )
}