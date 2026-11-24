import { Users, Compass, ShieldCheck } from 'lucide-react'

const features = [
  { icon: Compass, title: 'Discover interests', text: 'Explore clubs and communities built around the things you enjoy.' },
  { icon: Users, title: 'Find your people', text: 'Connect with othecrs through shared hobbies, creativity and goals.' },
  { icon: ShieldCheck, title: 'Community first', text: 'Make room for respectful conversations, privacy and safer interactions.' },
]

export default function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div id="about" className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#b64d73]">The LOVIQUE experience</p>
        <h2 className="mt-4 text-3xl font-semibold text-[#321526] md:text-4xl">Connection, with a little more meaning.</h2>
        <p className="mt-4 leading-7 text-gray-600">A welcoming space to express yourself and find communities where you feel included.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-3xl border border-rose-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f9e8ee] text-[#a64268]"><Icon size={23} /></div>
            <h3 className="text-xl font-semibold text-[#321526]">{title}</h3>
            <p className="mt-3 leading-7 text-gray-600">{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
