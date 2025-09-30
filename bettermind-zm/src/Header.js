// import React, { useState } from 'react';
import { Brain, Home, Info, Grid, MessageSquare, LogIn, UserPlus } from 'lucide-react';

// The onLoginModal and openSignupForm functions are passed as props
function Header({ openLoginModal, openSignupForm }) {
    
    // We can keep the state for future use (e.g., active tab highlighting) but remove the toggler function.
    // const [openMenu, setOpenMenu] = useState(false);
    
    // The mobile menu is now removed, so we only need the desktop header logic.

    const navLinks = [
        { href: '#home', label: 'Home', icon: Home },
        { href: '#about', label: 'About', icon: Info },
        { href: '#services', label: 'Services', icon: Grid },
        { href: '#contact', label: 'Contact', icon: MessageSquare },
    ];

    return (
        <>
            {/* -------------------------------------------------------------------------------------------------- */}
            {/* Main Header (Sticky Top) - Visible on all screens, but primary for desktop branding */}
            <header className="sticky top-0 z-30 bg-[#f4f5f6] shadow-lg transition-colors duration-300">
                
                {/* Desktop Layout (Hidden below lg, flex above lg) */}
                <div className='hidden lg:flex justify-between items-center w-full max-w-7xl mx-auto py-4 px-6'>
                    
                    {/* Logo Container */}
                    <div className="flex items-center space-x-2">
                        <Brain size={32} className="text-[#008080]" />
                        <h1 className='text-xl font-extrabold text-[#333333] tracking-tight'>
                            BetterMind Zm
                        </h1>
                    </div>

                    {/* Navigation and Auth Buttons (Desktop) */}
                    <div className="flex items-center space-x-8">
                        {/* Nav Links */}
                        <nav className="flex space-x-6 text-[#333333] font-medium">
                            {navLinks.map(link => (
                                <a key={link.href} href={link.href} className="hover:text-[#008080] transition-colors">
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                        
                        {/* Auth Buttons */}
                        <div className="flex space-x-3">
                            <button 
                                className="text-[#008080] font-semibold px-4 py-2 rounded-full transition-all hover:bg-[#9bb8a1]/30" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    openLoginModal();
                                }}>
                                Sign in
                            </button>
                            <button 
                                className="bg-[#008080] text-white font-semibold px-5 py-2 rounded-full shadow-md transition-all hover:bg-[#006666] hover:shadow-lg" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    openSignupForm();
                                }}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Logo Only (Visible below lg, fixed nav is separate) */}
                <div className='flex lg:hidden justify-betweenitems-center w-full py-5 px-4'>
                    <div className="flex justify-between space-x-4">
                        <Brain size={28} className="text-[#008080]" />
                        <h1 className='text-lg font-extrabold text-[#333333] tracking-tight text-end'>
                            BetterMind Zm
                        </h1>
                    </div>
                </div>
            </header>

            {/* -------------------------------------------------------------------------------------------------- */}
            {/* Mobile Fixed Bottom Navigation (New Element) */}
            <div className='fixed bottom-0 left-0 w-full lg:hidden bg-[#f4f5f6] border-t border-gray-200 shadow-2xl z-40'>
                <nav className='flex justify-around items-center h-16'>
                    {/* Navigation Links */}
                    {navLinks.map((link, index) => (
                        <a 
                            key={index} 
                            href={link.href} 
                            className='flex flex-col items-center justify-center p-1 text-xs font-medium text-[#333333] hover:text-[#008080] transition-colors'
                        >
                            <link.icon size={20} className='mb-0.5' />
                            {link.label}
                        </a>
                    ))}

                    {/* Sign In (Modified to fit small screen) */}
                    <button 
                        className='flex flex-col items-center justify-center p-1 text-xs font-medium text-[#333333] hover:text-[#008080] transition-colors'
                        onClick={(e) => {
                            e.preventDefault();
                            openLoginModal();
                        }}
                    >
                        <LogIn size={20} className='mb-0.5' />
                        Sign in
                    </button>
                    
                    {/* Sign Up (Icon version) */}
                    <button 
                        className='flex flex-col items-center justify-center p-1 text-xs font-medium text-[#333333] hover:text-[#008080] transition-colors'
                        onClick={(e) => {
                            e.preventDefault();
                            openSignupForm();
                        }}
                    >
                        <UserPlus size={20} className='mb-0.5' />
                        Sign Up
                    </button>
                </nav>
            </div>
            {/* Added padding to the body for mobile to prevent content from hiding behind the fixed nav */}
            <div className='lg:hidden' style={{ paddingBottom: '0px' }}></div>
        </>
    );
}

export default Header;