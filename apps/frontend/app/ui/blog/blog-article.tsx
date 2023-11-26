import React from 'react';
import { fetchBlogArticleContent } from '@/lib/data';
import BlogArticleContent from '@/ui/blog/blog-article-content';
import { parseISO, format } from 'date-fns';
import BlogViewCount from '@/ui/blog/blog-viewcount';

const BlogArticle = async ({
    children,
    slug,
}: {
    children: React.ReactNode;
    slug: string;
}) => {
    const blogArticleContent = await fetchBlogArticleContent(slug);
    const date = parseISO(blogArticleContent.data[0].attributes.publishedAt);

    return (
        <div className="border-grey/[.55] relative mx-auto max-w-screen-lg border-l border-r px-4 pb-16 pt-16 text-white">
            {children}
            {blogArticleContent.data.length > 0 && (
                <>
                    {/* @ts-ignore */}
                    <BlogArticleContent content={blogArticleContent.data[0].attributes.body} />
                </>
            )}
            <div className="text-md absolute bottom-5 mb-3 flex gap-5 font-extralight text-slate-400">
                <span>Published at: {format(date, 'd.LL.yyyy')}</span>
                <span>//</span>
                <BlogViewCount slug={slug} />
            </div>
        </div>
    );
};

export default BlogArticle;
