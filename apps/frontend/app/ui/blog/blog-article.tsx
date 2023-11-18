import React from 'react';
import { fetchBlogArticleContent } from '@/lib/data';
import BlogArticleContent from '@/ui/blog/blog-article-content';
import { parseISO, format } from 'date-fns';

const BlogArticle = async ({ children, slug }: { children: React.ReactNode, slug: string }) => {
    const blogArticleContent = await fetchBlogArticleContent(slug);
    const date = parseISO(blogArticleContent.data[0].attributes.publishedAt);

    return (
        <div className='border-grey/[.55] pt-16 pb-16 px-4 mx-8 md:mx-auto text-white max-w-screen-lg border-r border-l relative'>
            {children}
            {blogArticleContent.data.length > 0 && (
                // @ts-ignore
                <BlogArticleContent content={blogArticleContent.data[0].attributes.body} />
            )}
            <div className="mb-3 text-md font-extralight text-slate-400 absolute bottom-5 left-8">
                Published at: {format(date, 'd.LL.yyyy')}
            </div>
        </div>
    )
}

export default BlogArticle