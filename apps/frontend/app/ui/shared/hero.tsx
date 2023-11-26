import React from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(
    () => import('@/ui/shared/globe').then((mod) => mod.default),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-[500px] w-full animate-pulse items-center justify-center text-white">
                <span>Loading the globe!</span>
            </div>
        ),
    }
);

const HomepageHero = () => {
    return (
        <div>
            <div className="border-grey/[.55] flex flex-col border-b md:h-screen md:flex-row">
                <div className="m-auto mt-20 flex flex-col justify-center space-y-3 pl-10 pr-10 text-white md:mt-auto md:flex-1">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold md:text-8xl">
                            Dragan <br /> Balatinac
                        </h1>
                        <h3 className="mt-4 text-xl font-thin md:text-4xl">
                            Full-Stack Developer
                        </h3>
                        <p className="mt-4 italic">
                            Making the web work and look nice!
                        </p>
                    </div>
                </div>
                <div className="border-grey/[.55] md:flex-1 md:border-l ">
                    <div className="flex-col">
                        <div className="md:border-grey/[.55] relative h-[400px] overflow-hidden overflow-x-hidden md:h-[70vh] md:border-b">
                            <Globe />
                        </div>
                        <div className="flex h-[400px] flex-col justify-center space-y-5 p-10 font-thin text-white md:h-[30vh]">
                            <p>
                                If we want users to like our software, we should
                                design it to behave like a likable person.
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
