import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { parseISO, format } from 'date-fns';
import Link from 'next/link';

const BlogCard = ({ blog }) => {
    const date = parseISO(blog.attributes.publishedAt);
    const blogSlug = '/blog/' + blog.attributes.slug;

    return (
        <article className='hover:shadow-sm hover:shadow-light flex flex-col text-white border p-10 border-grey/[.55] rounded-lg hover:bg-dark transition-all'>
            <div className='flex flex-row gap-4'>
                <div className='flex flex-col'>
                    <span className='mb-3 font-extralight text-slate-400 text-sm'>{format(date, 'd.LL.yyyy')}</span>
                    <h5 className='text-3xl mb-5'>{blog.attributes.title}</h5>
                    <p>{blog.attributes.shortDescription}</p>
                </div>
            </div>
            <div className='mt-10'>
                <Link href={blogSlug} className='pt-3 pb-3 flex gap-4 items-center hover:underline'>Read more <FiArrowRight /></Link>
            </div>
        </article>
    )
}

export default BlogCard