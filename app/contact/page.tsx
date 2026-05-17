import PageTransition from '@/components/layout/PageTransition'
import SectionTitle from '@/components/ui/SectionTitle'
import GoldDivider from '@/components/ui/GoldDivider'
import MobileBackButton from '@/components/product/MobileBackButton'

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="bg-ivory min-h-screen pt-24 pb-12">
        <section className="px-8 py-16 max-w-6xl mx-auto">
          <MobileBackButton />
          <SectionTitle
            eyebrow="Contact Us"
            heading="Inquiries & Appointments"
            subheading="Whether you are inquiring about a piece in our collection or wish to discuss a bespoke commission, our team is here to assist you."
            align="center"
          />

          <GoldDivider className="my-16" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 shadow-sm border border-stone-100">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-body text-xs uppercase tracking-widest text-stone-500 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-ivory border-stone-200 focus:border-gold focus:ring-0 transition-colors p-3 font-body text-stone-900 outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-body text-xs uppercase tracking-widest text-stone-500 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-ivory border-stone-200 focus:border-gold focus:ring-0 transition-colors p-3 font-body text-stone-900 outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block font-body text-xs uppercase tracking-widest text-stone-500 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full bg-ivory border-stone-200 focus:border-gold focus:ring-0 transition-colors p-3 font-body text-stone-900 outline-none appearance-none"
                  >
                    <option>General Inquiry</option>
                    <option>Bespoke Commission</option>
                    <option>Private Appointment</option>
                    <option>Order Status</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block font-body text-xs uppercase tracking-widest text-stone-500 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full bg-ivory border-stone-200 focus:border-gold focus:ring-0 transition-colors p-3 font-body text-stone-900 outline-none resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-obsidian text-ivory font-body text-xs uppercase tracking-widest py-4 hover:bg-gold transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-16">
              <div>
                <h3 className="font-display text-2xl text-stone-900 mb-6 tracking-wide">Visit Our Atelier</h3>
                <div className="font-body text-stone-600 space-y-2 leading-relaxed">
                  <p>123 Luxury Lane</p>
                  <p>New York, NY 10001</p>
                  <p className="pt-4 italic">By Appointment Only</p>
                </div>
              </div>

              <div>
                <h3 className="font-display text-2xl text-stone-900 mb-6 tracking-wide">Direct Contact</h3>
                <div className="font-body text-stone-600 space-y-4">
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-stone-400 mb-1">Email</span>
                    <a href="mailto:concierge@urjajewels.com" className="text-stone-900 hover:text-gold transition-colors">concierge@urjajewels.com</a>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-stone-400 mb-1">Phone</span>
                    <a href="tel:+12125550198" className="text-stone-900 hover:text-gold transition-colors">+1 (212) 555-0198</a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-2xl text-stone-900 mb-6 tracking-wide">Follow Our Story</h3>
                <div className="flex gap-6">
                  <a href="#" className="font-body text-xs uppercase tracking-widest text-stone-600 hover:text-gold transition-colors">Instagram</a>
                  <a href="#" className="font-body text-xs uppercase tracking-widest text-stone-600 hover:text-gold transition-colors">Pinterest</a>
                  <a href="#" className="font-body text-xs uppercase tracking-widest text-stone-600 hover:text-gold transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview or Map could go here */}
      </div>
    </PageTransition>
  )
}
