import Navigation from '@/ui/shared/navigation'
import Footer from '@/ui/shared/footer';
import { Suspense } from 'react';
import { fetchBlogArticleContent } from '@/lib/data';

export default async function Blog({ params }: { params: { slug: string } }) {
  const blogArticle = await fetchBlogArticleContent(params.slug);

  return (
    <main className='font-mono font-light'>
      <Navigation />

      <Footer />
    </main>
  )
}
