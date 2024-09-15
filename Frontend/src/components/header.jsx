import React from 'react';

const Header = ({ title }) => {
    return (
        <header className=" text-[#0056b3] p-4 shadow-md" style={{ width: '100%', height: '45px' }}>            
            <div className="container mx-auto flex justify-start items-center">
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>
        </header>
    );
};

export default Header;
