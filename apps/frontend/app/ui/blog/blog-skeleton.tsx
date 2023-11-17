import React from 'react';

const BlogSkeletonCard = () => {
    return (
        <article className='border p-10 border-grey/[.55] rounded-lg transition-all h-30 opacity-20'>
            <div className="h-2 bg-white rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-white rounded-full max-w-[480px] mb-5"></div>
            <div className="h-2 bg-white rounded-full mb-5"></div>
            <div className="h-2 bg-white rounded-full max-w-[440px] mb-5"></div>
            <div className="h-2 bg-white rounded-full max-w-[460px] mb-5"></div>
            <div className="h-2 bg-white rounded-full max-w-[360px] mb-5"></div>
            <div className="h-2 bg-white rounded-full max-w-[460px] mb-5"></div>
            <div className="h-2 bg-white rounded-full max-w-[360px]"></div>
        </article>
    )
}

const BlogSkeleton = () => {
    return (
        <div className='border-b pb-32 border-grey/[.55]' id='blog'>
            <div className='mt-32 ml-10 mr-10 flex flex-col content-center'>
                <h2 className='mb-10'>
                    <a className='text-white font-semibold text-5xl hover:decoration-3 hover:underline' href="#blog">Blog</a>
                </h2>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 animate-pulse'>
                    <BlogSkeletonCard />
                    <BlogSkeletonCard />
                    <BlogSkeletonCard />
                </div>
            </div>
        </div>
    )
}

export default BlogSkeleton