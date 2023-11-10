'use client';

import React, { useState } from 'react';
import clsx from 'clsx';


const MobileNavigation = (
    isOpen: boolean = false,
) => {
    return (
        <nav className={clsx(isOpen ?? 'block', 'md:hidden')}>
            <ul>
                <li>
                    <a href="/">Home</a>
                </li>
            </ul>
        </nav>
    )
}

const Navigation = () => {
    const [mobileNavigationToggle, setMobileNavigationToggle] = useState(false);

    const mobileNavigationClickHandler = () => {
        if (mobileNavigationToggle === false) {
            
            setMobileNavigationToggle(true);
        } else {
            setMobileNavigationToggle(false);
        }

        console.log(mobileNavigationToggle);
    }

    return (
        <div className="border-b border-l border-t border-grey/[.55] m-auto">
            <div className="flex flex-row justify-between">
                <div className="branding text-white p-10 border-r border-grey/[.55]">balatinac.dev</div>
                <nav className='hidden md:block'>
                    <ul className='flex flex-row'>
                        <li className='p-10 border-l border-grey/[.55] hover:bg-light cursor-pointer transition'>
                            <a className="text-white" href="/">Home</a>
                        </li>
                        <li className='p-10 border-l border-grey/[.55] hover:bg-light cursor-pointer transition'>
                            <a className="text-white" href="/">Projects</a>
                        </li>
                        <li className='p-10 border-l border-grey/[.55] hover:bg-light cursor-pointer transition'>
                            <a className="text-white" href="/">Blog</a>
                        </li>
                    </ul>
                </nav>
                <button className='border-l border-grey/[.55] md:hidden p-10 text-white hover:bg-light' onClick={mobileNavigationClickHandler}>
                    ---
                </button>
                {/* <MobileNavigation /> */}
            </div>
        </div>
    )
}

export default Navigation