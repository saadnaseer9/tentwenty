import HeroSlider from '@/components/HeroSlider'
import Navigation from '@/components/Navigation'
import ImageSlider from '@/components/ImageSlider'


export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSlider />
      <ImageSlider/>
    </main>
  )
}