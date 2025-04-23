import React, { useState } from 'react';

const Navbar: React.FC = () => {

  return (
    <div className="bg-white w-full">
        <div className="flex justify-between items-center py-[1.5rem] px-[2rem]">
            <div className='text-[#4B9CD3] font-semibold text-[1.5rem]'>
                HUES APPLY 
            </div>
            <div className='text-[#333333] font-semibold text-[1rem] flex items-center gap-6'>
                <a href="#" className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition">Home</a>
                <a href="#" className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition">About us</a>
                <a href="#" className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition">Dashboard</a>
                <a href="#" className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition">Services</a>
                <a href="#" className="hover:text-[#4B9CD3] hover:bg-[#4B9CD31A] px-4 py-2 rounded-full transition">Contact</a>
            </div>
            <div className='flex items-center gap-4 font-semibold text-[1rem] text-[#333333] '>
                <button className="px-8 py-3 rounded-full">Login</button>
                <button className="px-8 py-3 bg-[#4B9CD3] text-white rounded-full text-sm transition">Register</button>
            </div>
        </div>
    </div>
  );
};

export default Navbar;
