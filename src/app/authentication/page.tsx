"use client";
import React, { useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

export default function Login() {
    const [email, setEmail] = useState('');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
    };

    /* Button to change to registering an account*/
    function handleCLick() {
        return;

    };

    return (
        <div className="login-container">

            <h1>Create an account</h1>

       
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
                <button type="button" onClick={handleCLick}>Sign In</button>
            </form>
        </div>
    );
};
