import React from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('@/ui/shared/globe').then((mod) => mod.default), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] flex justify-center items-center text-white animate-pulse">
            <span>Loading the globe!</span>
        </div>
    ),
});

const HomepageHero = () => {
    return (
        <div>
            <div className="border-grey/[.55] flex flex-col border-b md:h-screen md:flex-row">
                <div className="m-auto flex flex-col mt-20 md:mt-auto justify-center space-y-3 pl-10 pr-10 text-white md:flex-1">
                    <div className='text-center md:text-left'>
                        <h1 className="text-4xl font-bold md:text-8xl">
                            Dragan <br /> Balatinac
                        </h1>
                        <h3 className="text-xl font-thin mt-4 md:text-4xl">
                            Full-Stack Developer
                        </h3>
                        <p className='mt-4 italic'>Making the web work and look nice!</p>
                    </div>
                </div>
                <div className="border-grey/[.55] md:flex-1 md:border-l ">
                    <div className="flex-col">
                        <div className="md:border-grey/[.55] relative h-[400px] overflow-hidden overflow-x-hidden md:h-[70vh] md:border-b">
                            <Globe />
                        </div>
                        <div className="h-[400px] space-y-5 p-10 font-thin text-white md:h-[30vh] flex flex-col justify-center">
                            <p>
                                If we want users to like our software, we should design it to behave like a likable person.
                            </p>
                            <p>- Alan Cooper</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomepageHero;
