import './Navbar.css';

import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Navbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

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