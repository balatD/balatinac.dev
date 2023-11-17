import React from 'react';
import BlogCard from '@/ui/blog/blog-card';
import type { BlogArticle } from '@/lib/definitions';
import { fetchAllBlogArticles } from '@/lib/data';

const BlogList = async () => {
    const blogArticles = await fetchAllBlogArticles();

    return (
        <div className="border-grey/[.55] border-b pb-32" id="blog">
            <div className="ml-10 mr-10 mt-32 flex flex-col content-center">
                <h2 className="mb-10">
                    <a
                        className="hover:decoration-3 text-5xl font-semibold text-white hover:underline"
                        href="#projects"
                    >
                        Blog
                    </a>
                </h2>
                {blogArticles.data && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                        {blogArticles?.data.map((blogArticle: BlogArticle) => (
                            <BlogCard key={blogArticle.id} blog={blogArticle} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
