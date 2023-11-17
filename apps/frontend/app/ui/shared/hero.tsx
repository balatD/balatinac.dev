import React from 'react';
import Image from 'next/image';

const HomepageHero = () => {
    return (
        <div>
            <div className="border-grey/[.55] flex flex-col border-b md:h-screen md:flex-row">
                <div className="m-auto mb-20 mt-10 mt-20 flex flex-col justify-center space-y-3 pl-10 pr-10 text-white md:flex-1">
                    <div>
                        <h1 className="text-4xl font-bold md:text-8xl">
                            Dragan <br /> Balatinac
                        </h1>
                        <h3 className="text-xl font-thin md:text-4xl">
                            Full-Stack Developer
                        </h3>
                    </div>
                </div>
                <div className="border-grey/[.55] md:flex-1 md:border-l">
                    <div className="flex-col">
                        <div className="relative h-[400px] overflow-x-hidden md:h-[70vh]">
                            <div className="animate-blob absolute -left-4 top-0 h-72 w-72 rounded-full bg-slate-500 opacity-70 mix-blend-color-dodge blur-xl filter"></div>
                            <div className="bg-light animate-blob animation-delay-2000 absolute -right-4 top-20 h-72 w-72 rounded-full opacity-70 mix-blend-color-dodge blur-xl filter"></div>
                            {/* Disable till proper image is found */}
                            {/* <Image className='object-cover' src='/portrait.png' alt='Picture of the author' fill={true} /> */}
                        </div>
                        <div className="h-[400px] space-y-5 p-10 font-thin text-white md:h-[30vh]">
                            <p>
                                Lorem ipsum dolor sit, amet consectetur
                                adipisicing elit. Perspiciatis, sequi!
                            </p>
                            <p>- Test, 2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomepageHero;
