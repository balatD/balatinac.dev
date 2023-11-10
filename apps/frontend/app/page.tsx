import Image from 'next/image'
import Navigation from './ui/shared/navigation'
import HomepageHero from './ui/shared/hero'


export default function Home() {
  return (
    <main className='font-mono font-light'>
      <Navigation />
      <HomepageHero />
    </main>
  )
}
