import Link from 'next/link'


export default function Header() {
    return (
        <div className="">
            <nav className="">
                <Link href="/authentication">Login</Link>
                <Link href="/home">Home</Link>
            </nav>
        </div>
    )
}
