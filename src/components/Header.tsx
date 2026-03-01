'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import supabase from '@lib/supabase'
import { useRouter } from 'next/navigation'


export default function Header() {
    // User logout-functionality
    const router = useRouter()

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error(error.message)
            return
        }
        console.log(`User signed out`)
        router.replace('/authentication')
    }

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
        <div className='mt-2.5 px-2.5'>
            <nav
                className='
                    flex flex-row justify-between items-center gap-10
                    border border-stone-700 rounded-md 
                    px-6.25 py-2.5

                '
            >
                <div
                    className='flex flex-row gap-3 items-center'>
                    <img 
                        src='/GitHub.svg'
                        alt='GitHub Icon'
                        className='size-8'
                    />                           
                    <a 
                        href='https://github.com/PaivarintaEmilia/expense-tracker'
                        className='text-lg'
                        target="_blank"
                    >GitHub Repository</a>
                </div>

                {loggedIn && (
                    <Link
                        href='/authentication'
                        className='
                        mt-2
                        inline-flex items-center justify-center
                        rounded-md
                        border border-sky-300
                        px-4 py-2
                        text-[18px] font-bold
                        text-white-900
                        mb-0.75
                        bg-sky-600
                        transition
                        hover:bg-stone-800 hover:shadow 
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
                        active:translate-y-px
                        disabled:opacity-50 disabled:cursor-not-allowed
                        '
                        onClick={signOut}
                    >
                        Sign Out
                    </Link>
                )}
            </nav>
        </div>
    )
}
