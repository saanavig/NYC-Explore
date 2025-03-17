import './Navbar.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import UserDropdown from './UserDropdown';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Navbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">NYC Explore</Link>
            </div>
            <div className="nav-links">
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/" className="nav-link">Home</Link>
                <UserDropdown user={user} />
            </div>
        </nav>
    );
};

export default Navbar;