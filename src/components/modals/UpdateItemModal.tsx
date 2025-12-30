'use client';
import React from 'react';
import Modal from './Modal';
import UpdateDataForm from '@components/UpdateDataForm';

type Categories = { category_id: number; category_name: string };

type UpdateItemModalProps = {
    open: boolean;
    onClose: () => void;

    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    amount: number;
    description: string;

    amountOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    descriptionOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    categoryId: number | '';
    categoryOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    categoriesList: Categories[];
};

export default function UpdateItemModal({
    open,
    onClose,
    onSubmit,
    amount,
    description,
    amountOnChange,
    descriptionOnChange,
    categoryId,
    categoryOnChange,
    categoriesList,
}: UpdateItemModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <UpdateDataForm
                onSubmit={onSubmit}
                amountOnChange={amountOnChange}
                descriptionOnChange={descriptionOnChange}
                cancelFunction={onClose}
                amount={amount}
                description={description}
                categoryOnChange={categoryOnChange}
                categoryId={categoryId}
                categoriesList={categoriesList}
            />
        </Modal>
    );
}
