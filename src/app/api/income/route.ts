import React from 'react';
import { NextResponse } from 'next/server';
import supabase from '../../../../supabase/client';



/*INCOME CRUD OPERATION GET */
export async function GET() {


    let { data: income, error } = await supabase
        .from('income')
        .select('income_amount')

    //console.log(income);

    if (error) {
        return console.log(error);
    }

    return NextResponse.json(income);
};
