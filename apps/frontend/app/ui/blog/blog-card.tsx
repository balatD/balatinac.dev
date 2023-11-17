import { BlogArticle } from '@/lib/definitions';
import { FiArrowRight } from 'react-icons/fi';
import { parseISO, format } from 'date-fns';
import Link from 'next/link';

interface BlogCardProps {
    blog: BlogArticle;
}

const BlogCard = ({ blog }: BlogCardProps) => {
    const date = parseISO(blog.attributes.publishedAt);
    const blogSlug = `/blog/${blog.attributes.slug}`;

    return (
        <article className="hover:shadow-lighterDark border-grey/[.55] hover:bg-lighterDark flex flex-col rounded-lg border p-10 text-white transition-all hover:shadow-md">
            <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                    <span className="mb-3 text-sm font-extralight text-slate-400">
                        {format(date, 'd.LL.yyyy')}
                    </span>
                    <h5 className="mb-5 text-3xl">{blog.attributes.title}</h5>
                    <p>{blog.attributes.shortDescription}</p>
                </div>
            </div>
            <div className="mt-10">
                <Link
                    href={blogSlug}
                    className="flex items-center gap-4 pb-3 pt-3 hover:underline"
                >
                    Read more <FiArrowRight />
                </Link>
            </div>
        </article>
    );
};

export default BlogCard;
