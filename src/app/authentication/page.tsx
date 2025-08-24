'use client'
import React, { useState } from 'react'
import supabase from '@lib/supabase'
import { useRouter } from 'next/navigation'



export default function Login() {


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
        <div className="min-h-screen flex items-center justify-center px-4">
            {/** Sign-in | Registration card */}

            <div
                className="
                    flex flex-col items-center justify-center gap-6
                    w-full max-w-sm
                    md:max-w-[380px] md:h.[520px]
                    lg:max-w-[400px] lg:h-[550px]
                    rounded-[15px] border-2 border-white-700
                    shadow-sm
                    p-6 md:p-7 lg:p-8
                    bg-white-800
                "

            >
                <h1 className="text-[23px] font-medium leading-snug text-white-900">Create an account</h1>

                <form onSubmit={handleEmailRegistration} className="w-400px flex flex-col gap-4">
                    <label htmlFor="email" className="text-[18] font-light text-white-800"></label>
                    <input
                        type="email"
                        id="email"
                        placeholder="email@"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="
                            w-full
                            rounded-md
                            border border-neutral-600
                            px-3 py-2
                            text-base
                            outline-none
                            transition
                            hover:border-gray-400
                            focus:border-sky-600 focus:ring-2 focus:ring-sky-200
                            placeholder:text-gray-400 font-light
                        "
                    />
                    <button
                        type="submit"
                        className="
                        mt-2
                        inline-flex items-center justify-center
                        rounded-md
                        border border-sky-300
                        px-4 py-2
                        text-[15px] font-bold
                        text-white-900
                        bg-sky-600
                        transition
                        hover:bg-stone-800 hover:shadow 
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
                        active:translate-y-[1px]
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    >Send Magic Link</button>
                </form>
                {/* Show error message */}
                <h2 className="text-[18px] font-light text-red-600 text-center" aria-live="polite">{error}</h2>
            </div>
        </div>
    )
}
