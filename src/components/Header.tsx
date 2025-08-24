'use client'
import Link from 'next/link'
//import supabase from '@lib/supabase'




export default function Header() {
    return (
        <div className="">
            <nav 
                className="
                    flex flex-row justify-end items-center gap-5
                    border border-sky-300 rounded-md   
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
                <Link 
                    href="/home"
                    className="
                        inline-flex items-center
                        text-[18px] font-normal
                        transition
                        hover:font-bold
                        "
                    >Home</Link>
                <button 
                    className="
                        inline-flex items-center
                        text-[18px] font-normal 
                        transition
                        hover:font-bold
                        "
                    >Sign Out</button>
                {/** <button onClick={() => {supabase.auth.signOut}}>Sign Out</button> */}
            </nav>
        </div>
    )
}
