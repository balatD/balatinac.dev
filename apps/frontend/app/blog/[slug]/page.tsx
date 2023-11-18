import Navigation from '@/ui/shared/navigation';
import Footer from '@/ui/shared/footer';
import BlogArticle from '@/ui/blog/blog-article';
import { BlogArticleSkeleton } from '@/ui/blog/blog-skeleton';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { Suspense } from 'react';


export default async function Blog({ params }: { params: { slug: string } }) {
    return (
        <main className="font-mono font-light">
            <Navigation />
            <Suspense fallback={<BlogArticleSkeleton />}>
                <BlogArticle slug={params.slug}>
                    <Link href='/#blog' className='flex flex-row items-center gap-2 mb-5 hover:underline'><FiArrowLeft /> Back to Home</Link>
                </BlogArticle>
            </Suspense>
            <Footer />
        </main >
    );
}
