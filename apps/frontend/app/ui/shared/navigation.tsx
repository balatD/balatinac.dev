'use client';

import React, { useState } from 'react';

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
        <div className='border-b border-l border-t border-grey/[.55] m-auto'>
            <div className='flex flex-row justify-between'>
                <div className='branding text-white p-10 border-r border-grey/[.55]'>balatinac.dev</div>
                <nav className='hidden md:block'>
                    <ul className='flex flex-row'>
                        <li className='p-10 border-l border-grey/[.55] hover:bg-light cursor-pointer transition'>
                            <a className='text-white' href='/'>Home</a>
                        </li>
                        <li className='p-10 border-l border-grey/[.55] hover:bg-light cursor-pointer transition'>
                            <a className='text-white' href='/'>Projects</a>
                        </li>
                        <li className='p-10 border-l border-grey/[.55] hover:bg-light cursor-pointer transition'>
                            <a className='text-white' href='/'>Blog</a>
                        </li>
                    </ul>
                </nav>
                <button className='border-l border-grey/[.55] md:hidden p-10 text-white hover:bg-light flex flex-col' onClick={mobileNavigationClickHandler}>
                    {mobileNavigationToggle
                        ? <svg xmlns='http://www.w3.org/2000/svg' width='32px' height='32px' viewBox='-0.5 0 25 25' fill='none'>
                            <path d='M3 21.32L21 3.32001' stroke='#FFF' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                            <path d='M3 3.32001L21 21.32' stroke='#FFF' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                        : <svg xmlns='http://www.w3.org/2000/svg' width='32px' height='32px' viewBox='0 0 32 32' enableBackground='new 0 0 32 32' id='Editable-line' version='1.1'>
                            <line fill='none' id='XMLID_103_' stroke='#FFF' strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit='10' strokeWidth='2' x1='7' x2='25' y1='16' y2='16' />
                            <line fill='none' id='XMLID_102_' stroke='#FFF' strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit='10' strokeWidth='2' x1='7' x2='25' y1='25' y2='25' />
                            <line fill='none' id='XMLID_101_' stroke='#FFF' strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit='10' strokeWidth='2' x1='7' x2='25' y1='7' y2='7' />
                        </svg>

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