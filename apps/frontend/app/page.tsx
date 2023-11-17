import Navigation from '@/ui/shared/navigation';
import HomepageHero from '@/ui/shared/hero';
import TechStackSlider from '@/ui/tech-stack/tech-stack-slider';
import ProjectList from '@/ui/projects/projects-list';
import BlogList from '@/ui/blog/blog-list';
import Footer from '@/ui/shared/footer';
import ProjectsSkeleton from '@/ui/projects/projects-skeleton';
import BlogSkeleton from '@/ui/blog/blog-skeleton';
import { Suspense } from 'react';

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
