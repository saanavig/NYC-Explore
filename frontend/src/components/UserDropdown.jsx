import './UserDropdown.css';

import React, { useState } from 'react';

import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const UserDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:5173'
            }
        });
        if (error) console.error('Error:', error.message);
    };

    const handleSignup = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:5173'
            }
        });
        if (error) console.error('Error:', error.message);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error:', error.message);
    };

    return (
        <div className="dropdown-container">
            <div 
                className="dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                Hello, {user?.user_metadata?.full_name?.split(' ')[0] || 'Guest'}
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    {!user ? (
                        <>
                            <button onClick={handleLogin}>Login</button>
                            <button onClick={handleSignup}>Sign Up</button>
                        </>
                    ) : (
                        <button onClick={handleLogout}>Logout</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDropdown;