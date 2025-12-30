'use client'
import React from 'react'
import Modal from './Modal'

type ItemType = 'incomes' | 'expenses'
type SelectedItem = { id: string | null; type: ItemType | null }

type DeleteItemModalProps = {
    open: boolean
    selectedItem: SelectedItem
    onClose: () => void
    onConfirm: () => Promise<void>
}

export default function DeleteItemModal({
    open,
    selectedItem,
    onClose,
    onConfirm,
}: DeleteItemModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <p className='text-[16px] md:text-[18px] w-full text-center'>
                Do you want to delete the item {selectedItem.id}?
            </p>

            <div className='mt-6 flex justify-center gap-5'>
                <button
                    type='button'
                    className='
            inline-flex items-center
            text-[18px] font-normal
            mt-2 cursor-pointer
          '
                    onClick={onConfirm}
                >
                    Yes
                </button>

                <button
                    type='button'
                    className='
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
          '
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </Modal>
    )
}
