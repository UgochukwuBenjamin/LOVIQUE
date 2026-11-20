export default function Footer() {
  return (
    <footer id="community" className="bg-[#210d19] px-6 py-9 text-center text-sm text-rose-100/75">
      <p className="font-semibold tracking-[.2em] text-rose-100">LOVIQUE</p>
      <p className="mt-2">Connect • Match • Belong</p>
      <p className="mt-5 text-xs">© {new Date().getFullYear()} LOVIQUE. Built around respectful community.</p>
    </footer>
  )
}
