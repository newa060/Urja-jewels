import { getSiteContent } from '@/lib/site-content'
import { updateHeroQuoteAction, updateAboutPageAction } from '@/app/actions/site-content'

export default async function SiteContentPage() {
  const heroQuoteContent = await getSiteContent('hero_quote')
  const aboutPageContent = await getSiteContent('about_page')

  const heroQuote = heroQuoteContent?.content || {
    quote: "Crafted for those who understand that true luxury is measured in moments, not possessions.",
    author: "Urja Jewels",
    imageSrc: "/frames/Gold_dome_ring/Gold_dome_ring_on_stone_202605130855_050.webp"
  }

  const aboutPage = aboutPageContent?.content || {
    hero: { heading: "Crafting Eternity", subheading: "Founded on the principles of timeless elegance and master craftsmanship, Urja Jewels creates more than jewelry—we create legacies.", imageSrc: "" },
    history: { heading: "A Journey of Light", body: "Urja, meaning 'Energy' or 'Light' in Sanskrit, represents the radiant spirit within every gemstone we set. Our journey began with a simple vision: to bring the precision of modern design to the soul of traditional jewelry making.\n\nEach piece in our collection is born from a singular inspiration, developed through weeks of sketches, and brought to life by master artisans who have spent decades perfecting their craft." },
    craftsmanship: { quote: "Precision is our language. Perfection is our standard." },
    values: [
      { title: "Ethical Sourcing", body: "We are committed to the highest standards of integrity, sourcing only conflict-free diamonds and recycled gold." },
      { title: "Timeless Design", body: "Our designs transcend fleeting trends, crafted to remain as captivating decades from now as they are today." },
      { title: "Bespoke Mastery", body: "We offer a dedicated bespoke service, working closely with you to transform your vision into a unique masterpiece." }
    ]
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-[#0f172a]">Site Content</h1>
        <p className="text-[#64748b] mt-1">Manage the dynamic sections of your website&apos;s pages.</p>
      </div>

      <div className="space-y-12">
        {/* Home Page Content */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e5eeff]"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#94a3b8]">Home Page</h2>
            <div className="h-px flex-1 bg-[#e5eeff]"></div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#e5eeff] shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0f172a]">Hero Quote Section</h3>
              <p className="text-sm text-[#64748b]">Edit the parallax quote and background image.</p>
            </div>
            
            <form action={updateHeroQuoteAction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0f172a] mb-2">Quote Text</label>
                    <textarea
                      name="quote"
                      defaultValue={heroQuote.quote}
                      rows={4}
                      className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0f172a] mb-2">Author</label>
                    <input
                      type="text"
                      name="author"
                      defaultValue={heroQuote.author}
                      className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0f172a] mb-2">Background Image</label>
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none mb-4"
                  />
                  <input type="hidden" name="currentImageSrc" defaultValue={heroQuote.imageSrc} />
                  <div className="aspect-video rounded-xl overflow-hidden border border-[#e5eeff] bg-[#f8f9ff] relative">
                    {heroQuote.imageSrc && (
                      <img src={heroQuote.imageSrc} alt="Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#3525cd] text-white font-bold py-2.5 px-8 rounded-xl hover:bg-[#4338ca] transition-all shadow-lg shadow-[#4f46e5]/20 text-sm"
                >
                  Save Home Content
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* About Page Content */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e5eeff]"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#94a3b8]">About Page</h2>
            <div className="h-px flex-1 bg-[#e5eeff]"></div>
          </div>

          <form action={updateAboutPageAction} className="space-y-8">
            {/* About Hero */}
            <div className="bg-white p-8 rounded-2xl border border-[#e5eeff] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#0f172a]">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0f172a] mb-2">Heading</label>
                    <input type="text" name="heroHeading" defaultValue={aboutPage.hero.heading} className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0f172a] mb-2">Subheading</label>
                    <textarea name="heroSubheading" defaultValue={aboutPage.hero.subheading} rows={4} className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0f172a] mb-2">Hero Image</label>
                  <input
                    type="file"
                    name="heroImageFile"
                    accept="image/*"
                    className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none mb-4"
                  />
                  <input type="hidden" name="currentHeroImageSrc" defaultValue={aboutPage.hero.imageSrc} />
                  <div className="aspect-[4/5] w-48 rounded-xl overflow-hidden border border-[#e5eeff] bg-[#f8f9ff] relative mx-auto">
                    {aboutPage.hero.imageSrc && <img src={aboutPage.hero.imageSrc} alt="Hero" className="w-full h-full object-cover" />}
                  </div>
                </div>
              </div>
            </div>

            {/* About History */}
            <div className="bg-white p-8 rounded-2xl border border-[#e5eeff] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#0f172a]">Our History Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#0f172a] mb-2">Heading</label>
                  <input type="text" name="historyHeading" defaultValue={aboutPage.history.heading} className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0f172a] mb-2">Body Text</label>
                  <textarea name="historyBody" defaultValue={aboutPage.history.body} rows={8} className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none" />
                </div>
              </div>
            </div>

            {/* Craftsmanship Quote */}
            <div className="bg-white p-8 rounded-2xl border border-[#e5eeff] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#0f172a]">Craftsmanship Quote</h3>
              <div>
                <label className="block text-sm font-bold text-[#0f172a] mb-2">Quote Text</label>
                <input type="text" name="craftQuote" defaultValue={aboutPage.craftsmanship.quote} className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none" />
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-white p-8 rounded-2xl border border-[#e5eeff] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#0f172a]">Our Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-4 p-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff]">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1 uppercase tracking-wider">Value {i + 1} Title</label>
                      <input type="text" name={`value${i + 1}Title`} defaultValue={aboutPage.values[i].title} className="w-full bg-white border border-[#e5eeff] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4f46e5]/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1 uppercase tracking-wider">Value {i + 1} Body</label>
                      <textarea name={`value${i + 1}Body`} defaultValue={aboutPage.values[i].body} rows={4} className="w-full bg-white border border-[#e5eeff] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4f46e5]/20 resize-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-[#3525cd] text-white font-bold py-3 px-12 rounded-xl hover:bg-[#4338ca] transition-all shadow-lg shadow-[#4f46e5]/20"
              >
                Save About Page Content
              </button>
            </div>
          </form>
        </section>
      </div>

    </div>
  )
}
