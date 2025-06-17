"use client";
import React, { useState } from 'react';
import supabase from '../../../supabase/client';

export default function Login() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);


    const handleEmailRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Email:', email);
        setError("BUTTON PRESSED");

        try {
            const { data, error } = await supabase.auth.signInWithOtp({
                email: email,
            })

            if (error) {
                setError(error.message);
            } else {
                console.log('Registration successful:', data);
                // Add here navigation to the home-page
            }
        } catch (error) {
            console.log("Error during registration: ", error);
            setError("There was a error during the registration.")
        };

    };

    /* Button to change to registering an account*/
    function handleCLick() {
        return;
    };

    return (
        <div className="login-container">

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
                <button type="submit">Register</button>
            </form>
            <button type="button" onClick={handleCLick}>Sign In</button>
            {/* Show error message */}
            <h2>{error}</h2>

        </div>
    );
};
