import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, variant, filters, setFilters }) => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header variant={variant} />
            <div className="flex-1">
                <main className="mx-auto max-w-[1400px] p-4">
                    {/* Mobile Filter Button (Placeholder) */}
                    <div className="md:hidden flex items-center justify-end mb-3">
                        <button type="button" className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                            {/* Icon placeholder */}
                            Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <Sidebar filters={filters} setFilters={setFilters} />
                        <div className="lg:col-span-3">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
