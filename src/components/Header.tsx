'use client'
import Link from 'next/link'
//import supabase from '@lib/supabase'




export default function Header() {
    return (
        <div className="border-r border-r-lime-500 border-solid h-[80%]">
            <nav className="">
                <Link href="/authentication">Login</Link>
                <Link href="/home">Home</Link>
                <button className="">Sign Out</button>
                {/** <button onClick={() => {supabase.auth.signOut}}>Sign Out</button> */}
            </nav>
        </div>
    )
}
