import React from 'react';
import Image from 'next/image';


const HomepageHero = () => {
    return (
        <div className='min-h-screen'>
            <div className="flex flex-col md:flex-row h-screen border-b border-grey/[.55]">
                <div className="flex justify-center items-center md:justify-normal flex-1 text-white m-auto mt-auto pl-10 pr-10 space-y-3 min-h-[40vh]">
                    <div className="">
                        <h1 className='text-4xl md:text-8xl font-bold'>Dragan Balatinac</h1>
                        <h3 className='text-xl md:text-4xl font-thin'>Full-Stack Developer</h3>
                    </div>
                </div>
                <div className="flex-1 border-l border-grey/[.55]">
                    <div className="flex flex-col">
                        <div className="h-[70vh] relative">
                            <Image className='object-cover' src="https://source.unsplash.com/random/?blackandwhite,man,portrait" alt="Picture of the author" fill={true} />
                        </div>
                        <div className="h-[30vh] font-thin text-white p-10 space-y-5">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias veritatis sed vitae commodi iure odio, consectetur a mollitia voluptatibus iste?</p>
                            <p>- Test, 2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomepageHero