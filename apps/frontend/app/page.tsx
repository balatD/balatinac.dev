import Image from 'next/image'
import Navigation from '@/ui/shared/navigation'
import HomepageHero from '@/ui/shared/hero'
import TechStackSlider from '@/ui/tech-stack/tech-stack-slider';
import ProjectList from './ui/projects/projects-list';


export default function Home() {
  return (
    <main className='font-mono font-light'>
      <Navigation />
      <HomepageHero />
      <TechStackSlider />
      <ProjectList />
    </main>
  )
}
