import PageTransition from '@/components/layout/PageTransition'
import SectionTitle from '@/components/ui/SectionTitle'
import GoldDivider from '@/components/ui/GoldDivider'
import Image from 'next/image'
import { getSiteContent } from '@/lib/site-content'

export default async function AboutPage() {
  const aboutPageContent = await getSiteContent('about_page')
  
  const content = aboutPageContent?.content || {
    hero: { 
      heading: "Crafting Eternity", 
      subheading: "Founded on the principles of timeless elegance and master craftsmanship, Urja Jewels creates more than jewelry—we create legacies.", 
      imageSrc: "" 
    },
    history: { 
      heading: "A Journey of Light", 
      body: "Urja, meaning 'Energy' or 'Light' in Sanskrit, represents the radiant spirit within every gemstone we set. Our journey began with a simple vision: to bring the precision of modern design to the soul of traditional jewelry making.\n\nEach piece in our collection is born from a singular inspiration, developed through weeks of sketches, and brought to life by master artisans who have spent decades perfecting their craft. We believe that true luxury lies in the details that only the human eye can see and the human hand can feel." 
    },
    craftsmanship: { quote: "Precision is our language. Perfection is our standard." },
    values: [
      { title: "Ethical Sourcing", body: "We are committed to the highest standards of integrity, sourcing only conflict-free diamonds and recycled gold." },
      { title: "Timeless Design", body: "Our designs transcend fleeting trends, crafted to remain as captivating decades from now as they are today." },
      { title: "Bespoke Mastery", body: "We offer a dedicated bespoke service, working closely with you to transform your vision into a unique masterpiece." }
    ]
  }

  return (
    <PageTransition>
      <div className="bg-ivory min-h-screen pt-24">
        {/* Hero Section */}
        <section className="px-8 py-16 md:py-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle
                eyebrow="The Atelier"
                heading={content.hero.heading}
                subheading={content.hero.subheading}
                align="left"
              />
            </div>
            <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden rounded-sm border border-stone-200">
              {content.hero.imageSrc ? (
                <img src={content.hero.imageSrc} alt="About Urja Jewels" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-400 font-body text-sm uppercase tracking-widest">
                  Hero Image
                </div>
              )}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* Our Story Section */}
        <section className="px-8 py-24 max-w-5xl mx-auto text-center">
          <SectionTitle
            eyebrow="Our History"
            heading={content.history.heading}
            align="center"
          />
          <div className="mt-12 space-y-8 font-body text-stone-700 leading-relaxed max-w-2xl mx-auto">
            {content.history.body.split('\n\n').map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Full Bleed Craftsmanship Section */}
        <section className="relative h-[60vh] md:h-[80vh] bg-stone-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-stone-800 flex items-center justify-center">
             <span className="text-ivory/20 font-display text-4xl uppercase tracking-[0.5em]">Craftsmanship</span>
          </div>
          <div className="relative z-10 text-center px-8">
            <h2 className="font-display text-3xl md:text-5xl text-ivory tracking-wider max-w-3xl mx-auto leading-tight">
              &ldquo;{content.craftsmanship.quote}&rdquo;
            </h2>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-8 py-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {content.values.map((value: { title: string; body: string }, i: number) => (
              <div key={i} className="text-center">
                <h3 className="font-display text-xl text-stone-900 mb-4 tracking-wide">{value.title}</h3>
                <p className="font-body text-sm text-stone-600 leading-relaxed">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
