import React from 'react';

const ProjectsSkeletonCard = () => {
    return (
        <article className="border-grey/[.55] h-30 animate-pulse rounded-lg border p-10 opacity-20 transition-all">
            <div className="mb-4 h-2 w-48 rounded-full bg-white"></div>
            <div className="mb-5 h-2 max-w-[480px] rounded-full bg-white"></div>
            <div className="mb-5 h-2 rounded-full bg-white"></div>
            <div className="mb-5 h-2 max-w-[440px] rounded-full bg-white"></div>
            <div className="mb-5 h-2 max-w-[460px] rounded-full bg-white"></div>
            <div className="mb-5 h-2 max-w-[360px] rounded-full bg-white"></div>
            <div className="mb-5 h-2 max-w-[460px] rounded-full bg-white"></div>
            <div className="h-2 max-w-[360px] rounded-full bg-white"></div>
        </article>
    );
};

const ProjectsSkeleton = () => {
    return (
        <div className="border-grey/[.55] border-b pb-32" id="projects">
            <div className="ml-10 mr-10 mt-32 flex flex-col content-center">
                <h2 className="mb-10">
                    <a
                        className="hover:decoration-3 text-5xl font-semibold text-white hover:underline"
                        href="#projects"
                    >
                        Projects
                    </a>
                </h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                    <ProjectsSkeletonCard />
                    <ProjectsSkeletonCard />
                    <ProjectsSkeletonCard />
                </div>
            </div>
        </div>
    );
};

export default ProjectsSkeleton;
