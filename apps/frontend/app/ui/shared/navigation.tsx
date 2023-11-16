'use client';

import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Navigation = () => {
    const [mobileNavigationToggle, setMobileNavigationToggle] = useState(false);

    const mobileNavigationClickHandler = () => {
        if (mobileNavigationToggle === false) {
            setMobileNavigationToggle(true);
        } else {
            setMobileNavigationToggle(false);
        }
    }

    return (
        <div className='border-b border-l border-t border-r border-grey/[.55] m-auto'>
            <div className='flex flex-row justify-between'>
                <div className='branding text-white p-10 border-r border-grey/[.55]'>balatinac.dev</div>
                <nav className='hidden md:block'>
                    <ul className='flex flex-row'>
                        <li className='p-10 border-l border-grey/[.55] hover:bg-light cursor-pointer transition'>
                            <a className='text-white' href='/'>Home</a>
                        </li>
                        <li className='p-10 border-l border-grey/[.55] hover:bg-light cursor-pointer transition'>
                            <a className='text-white' href='#projects'>Projects</a>
                        </li>
                        <li className='p-10 border-l border-grey/[.55] hover:bg-light cursor-pointer transition'>
                            <a className='text-white' href='#blog'>Blog</a>
                        </li>
                    </ul>
                </nav>
                <button className='border-l border-grey/[.55] md:hidden p-10 text-white hover:bg-light flex flex-col' onClick={mobileNavigationClickHandler}>
                    {mobileNavigationToggle
                        ? <FiX size={24} />
                        : <FiMenu size={24} />

                    }
                </button>
            </div>
            <nav className={`${mobileNavigationToggle ? 'visible' : 'hidden'} md:hidden`}>
                <ul className='flex flex-col'>
                    <li className='p-10 border-r border-t border-grey/[.55] hover:bg-light cursor-pointer transition'>
                        <a className='text-white' href='/'>Home</a>
                    </li>
                    <li className='p-10 border-r border-t border-grey/[.55] hover:bg-light cursor-pointer transition'>
                        <a className='text-white' href='/'>Projects</a>
                    </li>
                    <li className='p-10 border-r border-t border-grey/[.55] hover:bg-light cursor-pointer transition'>
                        <a className='text-white' href='/'>Blog</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navigation