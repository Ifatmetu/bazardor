import React from 'react';
import Image from 'next/image';
import Navlinks from './Navlinks';



const Navbar = () => {

    const date = new Date().toLocaleDateString('bn-BD', {
        dateStyle: 'full',
    });

    return (
        <div className="flex justify-between items-center p-4 bg-white shadow-md w-6xl mx-auto">
            <div>
                
                <div className="flex items-center gap-2">
                        <Image className="h-10 w-auto bg-green-500 rounded-lg" src="/logo-icon.png" alt="Logo" width={40} height={40} />
                        <div>
                            <h2>
                                বাজার দর
                            </h2>
                            <p>
                                {date}
                            </p>

                        </div>
                </div>
                <div>
                    <Navlinks/>
                </div>
               
            </div>
            <div className="flex gap-2">
                <button className="btn">সাইন ইন</button>
                <button className="btn bg-green-500 text-white rounded-lg">সাইন আপ</button>
            </div>
        </div>
    );
    
};

export default Navbar;