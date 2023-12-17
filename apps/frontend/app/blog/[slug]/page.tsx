import Navigation from '@/ui/shared/navigation';
import Footer from '@/ui/shared/footer';
import BlogArticle from '@/ui/blog/blog-article';
import Link from 'next/link';
import { BlogArticleSkeleton } from '@/ui/blog/blog-skeleton';
import { FiArrowLeft } from 'react-icons/fi';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchBlogArticleMetadata } from '@/lib/data';
import { generateMetadataFromEndpoint } from '@/lib/metadata';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await fetchBlogArticleMetadata(params.slug);

  return generateMetadataFromEndpoint(
    data[0].attributes.seo,
    `blog/${params.slug}`
  );
}

export default async function Blog({ params }: Props) {
  return (
    <main className="font-mono font-light">
      <Navigation />      <Suspense fallback={<BlogArticleSkeleton />}>
        <BlogArticle slug={params.slug}>
          <Link
            href="/#blog"
            className="mb-5 flex flex-row items-center gap-2 hover:underline"
          >
            <FiArrowLeft /> Back to Home
          </Link>
        </BlogArticle>
      </Suspense>
      <Footer />
    </main>
  );
}
