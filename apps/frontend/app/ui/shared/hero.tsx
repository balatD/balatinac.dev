import React from 'react';
import Image from 'next/image';

const HomepageHero = () => {
    return (
        <div>
            <div className='flex flex-col md:flex-row md:h-screen border-b border-grey/[.55]'>
                <div className='flex flex-col justify-center md:flex-1 text-white m-auto mt-10 pl-10 pr-10 space-y-3 mt-20 mb-20'>
                    <div>
                        <h1 className='text-4xl md:text-8xl font-bold'>Dragan <br /> Balatinac</h1>
                        <h3 className='text-xl md:text-4xl font-thin'>Full-Stack Developer</h3>
                    </div>
                </div>
                <div className='md:flex-1 md:border-l border-grey/[.55]'>
                    <div className='flex-col'>
                        <div className='h-[400px] md:h-[70vh] relative overflow-x-hidden'>
                            <div className="absolute top-0 -left-4 w-72 h-72 bg-slate-500 rounded-full opacity-70 mix-blend-color-dodge filter blur-xl animate-blob"></div>
                            <div className="absolute top-20 -right-4 w-72 h-72 bg-light rounded-full opacity-70 mix-blend-color-dodge filter blur-xl animate-blob animation-delay-2000"></div>

                            <Image className='object-cover' src='/portrait.png' alt='Picture of the author' fill={true} />
                        </div>
                        <div className='h-[400px] md:h-[30vh] font-thin text-white p-10 space-y-5'>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis, sequi!</p>
                            <p>- Test, 2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomepageHero