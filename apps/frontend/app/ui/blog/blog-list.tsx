import React from 'react';
import BlogCard from '@/ui/blog/blog-card';
import type { BlogArticle } from '@/lib/definitions';
import { fetchAllBlogArticles } from '@/lib/data';

const BlogList = async () => {
    const blogArticles = await fetchAllBlogArticles();

    return (
        <div className='border-b pb-32 border-grey/[.55]' id='blog'>
            <div className='mt-32 ml-10 mr-10 flex flex-col content-center'>
                <h2 className='mb-10'>
                    <a className='text-white font-semibold text-5xl hover:decoration-3 hover:underline' href="#projects">Blog</a>
                </h2>
                {blogArticles.data &&
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8'>
                        {blogArticles?.data.map((blogArticle: BlogArticle) => <BlogCard key={blogArticle.id} blog={blogArticle} />)}
                    </div>
                }
            </div>
        </div>
    )
}

export default BlogList