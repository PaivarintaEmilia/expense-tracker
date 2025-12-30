'use client';
import React from 'react';
import Modal from './Modal';

type CreateCategoryModalProps = {
    open: boolean;
    onClose: () => void;
    newCategory: string;
    setNewCategory: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function CreateCategoryModal({
    open,
    onClose,
    newCategory,
    setNewCategory,
    onSubmit,
}: CreateCategoryModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <p className='text-[18px] md:text-[18px] w-full text-center'>
                Add a new category
            </p>

            <div className='mt-6 flex justify-center gap-5'>
                <form
                    onSubmit={(e) => {
                        onSubmit(e);
                        // halutessasi: setNewCategory('') tässä tai page.tsx:ssä
                    }}
                >
                    <input
                        type='text'
                        id='createCategory'
                        placeholder='Category name'
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className='                            
                            w-full
                            rounded-md
                            border border-neutral-600
                            px-3 py-2
                            text-gray-200 font-light
                            outline-none
                            transition
                            hover:border-gray-400
                            focus:border-sky-200 focus:ring-0.5 focus:ring-sky-200
                            mt-[12px]
                        '
                    />
                    <div className='mt-6 flex justify-center gap-5'>
                        <button
                            type='submit'
                            className='
                            inline-flex items-center
                            text-[16px] font-normal
                            mt-2 cursor-pointer
                        '
                        >
                            Create a new category
                        </button>
                        <button
                            onClick={onClose}
                            className='
                            mt-2
                            inline-flex items-center justify-center
                            rounded-md
                            border border-sky-300
                            px-4 py-2
                            text-[16px] font-bold
                            text-white-900
                            transition
                            hover:bg-stone-700 hover:shadow 
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200
                            active:translate-y-[1px]
                            disabled:opacity-50 disabled:cursor-not-allowed
                            cursor-pointer
                        '
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
