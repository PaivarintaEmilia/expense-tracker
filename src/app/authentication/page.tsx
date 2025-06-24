'use client'
import React, { useState } from 'react'
import supabase from '@lib/supabase'
import { useRouter } from 'next/navigation'
import session from '@hooks/session'


export default function Login() {
    session()

    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()


    const handleEmailRegistration = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log('Email:', email)
        setError('BUTTON PRESSED')

        try {
            const { data, error } = await supabase.auth.signInWithOtp({
                email: email,
            })

            if (error) {
                setError(error.message)
            } else {
                console.log('Registration successful:', data)
                router.push('home') // This might not be needed as the redirect link is determinated in Supabase
            }
        } catch (error) {
            console.log('Error during registration: ', error)
            setError('There was a error during the registration.')
        }

    }
    

    return (
        <div>

            <h1>Create an account</h1>

            <form onSubmit={handleEmailRegistration}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                <button type="submit">Send Magic Link</button>
            </form>
            {/* Show error message */}
            <h2>{error}</h2>

        </div>
    )
}
