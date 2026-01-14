
import React from 'react';

const Header = ({ variant }) => {
    return (
        <header className="bg-blue-600 shadow-md">
            <div className="w-full max-w-[1400px] mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                    <img
                        src="https://rivall-public.s3.us-west-1.amazonaws.com/logos/organization-logos/default.webp"
                        alt="Volo"
                        className="invert brightness-0 h-10 w-auto select-none"
                    />
                    {variant === 'B' && (
                        <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs font-bold border border-white/40">
                            TEST B
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8 text-[13px] font-extrabold text-white tracking-wide ml-auto mr-6">
                    <a href="#" className="uppercase hover:opacity-80 transition">Volo Kids</a>
                    <a href="#" className="uppercase hover:opacity-80 transition">Volo Pass</a>
                    <a href="#" className="uppercase hover:opacity-80 transition">Corporate</a>
                    <a href="#" className="uppercase hover:opacity-80 transition">Choose City</a>
                    <a href="#" className="uppercase hover:opacity-80 transition">About</a>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center space-x-3">
                    <button className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full border border-white text-white text-sm font-normal hover:bg-white/10 transition">
                        Login
                    </button>
                    <button className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#c7ff10] text-black text-sm font-normal hover:brightness-95 transition">
                        Sign up
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
