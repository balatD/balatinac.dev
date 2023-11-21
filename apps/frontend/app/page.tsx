import Navigation from '@/ui/shared/navigation';
import HomepageHero from '@/ui/shared/hero';
import TechStackSlider from '@/ui/tech-stack/tech-stack-slider';
import ProjectList from '@/ui/projects/projects-list';
import BlogList from '@/ui/blog/blog-list';
import Footer from '@/ui/shared/footer';
import ProjectsSkeleton from '@/ui/projects/projects-skeleton';
import { BlogSkeleton } from '@/ui/blog/blog-skeleton';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchPageMetadataBySlug } from '@/lib/data';
import { generateMetadataFromEndpoint } from '@/lib/metadata';

type Props = {
    params: { slug: string };
};

export async function generateMetadata(): Promise<Metadata> {
    const { data } = await fetchPageMetadataBySlug('homepage');

    return generateMetadataFromEndpoint(data[0].attributes.seo, '');
}

export default function Home() {
    return (
        <main className="font-mono font-light">
            <Navigation />
            <HomepageHero />
            <TechStackSlider />
            <Suspense fallback={<ProjectsSkeleton />}>
                <ProjectList />
            </Suspense>
            <Suspense fallback={<BlogSkeleton />}>
                <BlogList />
            </Suspense>
            <Footer />
        </main>
    );
}
