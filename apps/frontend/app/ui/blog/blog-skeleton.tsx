import React from 'react';

export const BlogArticleSkeleton = () => {
    return (
        <div className='border-grey/[.55] pt-16 pb-16 px-4 mx-8 md:mx-auto max-w-screen-lg border-r border-l '>
            <div className='animate-pulse'>
                <div className="mb-4 h-2 w-48 rounded bg-white"></div>
                <div className="mb-4 h-16 w-128 rounded bg-white"></div>
                <div className="mb-4 h-32 rounded bg-white"></div>
                <div className="mb-4 h-32 rounded bg-white"></div>
                <div className="mb-4 h-64 rounded bg-white"></div>
                <div className="mb-4 h-48 rounded bg-white"></div>
            </div>
        </div>
    );
}

const BlogSkeletonCard = () => {
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

export const BlogSkeleton = () => {
    return (
        <div className="border-grey/[.55] border-b pb-32" id="blog">
            <div className="ml-10 mr-10 mt-32 flex flex-col content-center">
                <h2 className="mb-10">
                    <a
                        className="hover:decoration-3 text-5xl font-semibold text-white hover:underline"
                        href="#blog"
                    >
                        Blog
                    </a>
                </h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                    <BlogSkeletonCard />
                    <BlogSkeletonCard />
                    <BlogSkeletonCard />
                </div>
            </div>
        </div>
    );
};