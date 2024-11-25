import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className='bg-white'>
            <Navbar />
            <div
                className='w-screen flex mx-auto pl-2'
                style={{ height: 'calc(100vh - 56px)' }}
            >
                <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-[60px]' : 'w-[220px]'}`}>
                  <div class="border-r border-gray-300 pr-2">
                    <button
                        onClick={toggleSidebar}
                        
                        className="px-5 py-1.5 mb-1 mt-2 text-gray-600 text-sm capitalize select-none hover:text-indigo-600 rounded transition-colors hover:bg-indigo-200/80 text-indigo-600 bg-indigo-200/80 w-full"
                    >
                        {isSidebarCollapsed ? '=' : '<'}
                    </button>
                    </div>
                    <Sidebar isCollapsed={isSidebarCollapsed} />
                </div>

                <div className="flex-1">
                    <div className="flex">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppLayout;
