'use Client'
import Link from 'next/link'
import supabase from '@lib/supabase'




export default function Header() {
    return (
        <div className="">
            <nav className="">
                <Link href="/authentication">Login</Link>
                <Link href="/home">Home</Link>
                <button onClick={() => {supabase.auth.signOut}}>Sign Out</button>
            </nav>
        </div>
    )
}
