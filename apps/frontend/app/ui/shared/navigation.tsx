'use client';

import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';

const Navigation = () => {
    const [mobileNavigationToggle, setMobileNavigationToggle] = useState(false);

    const mobileNavigationClickHandler = () => {
        if (mobileNavigationToggle === false) {
            setMobileNavigationToggle(true);
        } else {
            setMobileNavigationToggle(false);
        }
    };

    return (
        <div className="border-grey/[.55] m-auto border-b border-l border-r border-t">
            <div className="flex flex-row justify-between">
                <div className="branding border-grey/[.55] border-r p-10 text-white">
                    balatinac.dev
                </div>
                <nav className="hidden md:block">
                    <ul className="flex flex-row">
                        <Link href="/">
                            <li className="border-grey/[.55] hover:bg-light cursor-pointer border-l p-10 text-white transition">
                                Home
                            </li>
                        </Link>
                        <Link href="/#projects">
                            <li className="border-grey/[.55] hover:bg-light cursor-pointer border-l p-10 text-white transition">
                                Projects
                            </li>
                        </Link>
                        <Link href="/#blog">
                            <li className="border-grey/[.55] hover:bg-light cursor-pointer border-l p-10 text-white transition">
                                Blog
                            </li>
                        </Link>
                    </ul>
                </nav>
                <button
                    className="border-grey/[.55] hover:bg-light flex flex-col border-l p-10 text-white md:hidden"
                    onClick={mobileNavigationClickHandler}
                >
                    {mobileNavigationToggle ? (
                        <FiX size={24} />
                    ) : (
                        <FiMenu size={24} />
                    )}
                </button>
            </div>

            <nav
                className={`${
                    mobileNavigationToggle ? 'visible' : 'hidden'
                } md:hidden`}
            >
                <ul className="flex flex-col">
                    <li className="border-grey/[.55] hover:bg-light cursor-pointer border-r border-t p-10 transition">
                        <a className="text-white" href="/">
                            Home
                        </a>
                    </li>
                    <li className="border-grey/[.55] hover:bg-light cursor-pointer border-r border-t p-10 transition">
                        <a className="text-white" href="/">
                            Projects
                        </a>
                    </li>
                    <li className="border-grey/[.55] hover:bg-light cursor-pointer border-r border-t p-10 transition">
                        <a className="text-white" href="/">
                            Blog
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navigation;
