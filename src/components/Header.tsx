'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import supabase from '@lib/supabase'




export default function Header() {

    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setLoggedIn(!!session) // Changes the session-olio to boolean (if exists session = true)
        })

        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
            setLoggedIn(!!session)
        })

        return () => sub.subscription.unsubscribe()
    }, [])

    return (
        <div className="mt-[10px] px-[10px]">
            <nav
                className="
                    flex flex-row justify-end items-center gap-5
                    border border-stone-700 rounded-md 
                    px-[25px] py-[10px]
                "
            >
                <Link
                    href="/authentication"
                    className="
                        mt-2
                        inline-flex items-center justify-center
                        rounded-md
                        border border-sky-300
                        px-4 py-2
                        text-[15px] font-bold
                        text-white-900
                        mb-[3px]
                        bg-sky-600
                        transition
                        hover:bg-stone-800 hover:shadow 
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
                        active:translate-y-[1px]
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                >Login</Link>
                {loggedIn &&
                    <Link
                        href="/home"
                        className="
                        inline-flex items-center
                        text-[18px] font-normal
                        transition
                        hover:font-bold
                        "
                    >Home</Link>
                }

                <button
                    className="
                        inline-flex items-center
                        text-[18px] font-normal 
                        transition
                        hover:font-bold cursor-pointer
                        "
                >Sign Out</button>
                {/** <button onClick={() => {supabase.auth.signOut}}>Sign Out</button> */}
            </nav>
        </div>
    )
}
