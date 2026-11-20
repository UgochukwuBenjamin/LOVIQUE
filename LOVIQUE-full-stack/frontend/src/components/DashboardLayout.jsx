
import { NavLink, Outlet, Link } from "react-router-dom";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: "⌂" },
  { name: "Discover", path: "/discover", icon: "⌕" },
  { name: "Communities", path: "/communities", icon: "◉" },
  { name: "Messages", path: "/messages", icon: "✉" },
  { name: "Notifications", path: "/notifications", icon: "♧" },
  { name: "Settings", path: "/settings", icon: "⚙" }
];

export default function DashboardLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080808] text-white md:flex">

      {/* BACKGROUND LIGHT EFFECTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-700/20 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#C11235]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-red-900/10 rounded-full blur-[120px]" />
      </div>

      {/* SIDEBAR */}
      <aside className="relative z-10 w-full md:w-72 md:min-h-screen md:sticky md:top-0 p-5 md:p-6 border-b md:border-b-0 md:border-r border-white/10 bg-white/[0.04] backdrop-blur-2xl">

        {/* LOGO */}
        <Link to="/" className="inline-block group">
          <h1 className="text-3xl font-bold tracking-[0.15em] text-[#E21B45] group-hover:text-red-400 transition">
            LOVIQUE
          </h1>

          <p className="text-[9px] tracking-[0.35em] text-gray-500 mt-1">
            CONNECT. SHARE. BELONG.
          </p>
        </Link>

        {/* USER PROFILE */}
        <div className="hidden md:flex items-center gap-3 mt-12 mb-10 p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl">

          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E21B45] to-red-950 flex items-center justify-center font-bold text-lg shadow-lg shadow-red-900/30">
            U
          </div>

          <div>
            <h3 className="text-sm font-semibold">Welcome Back</h3>
            <p className="text-xs text-gray-500">Your LOVIQUE space</p>
          </div>

          <span className="ml-auto w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
        </div>

        {/* NAVIGATION */}
        <p className="hidden md:block text-[10px] tracking-[0.25em] text-gray-500 mb-4">
          MAIN MENU
        </p>

        <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2 mt-6 md:mt-0">

          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? "bg-[#C11235]/20 border-[#C11235]/40 text-white shadow-[0_0_20px_rgba(193,18,53,0.12)]"
                    : "border-transparent text-gray-400 hover:bg-white/[0.07] hover:border-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-xl transition ${
                    isActive ? "text-[#FF4268]" : "text-gray-500 group-hover:text-[#FF4268]"
                  }`}>
                    {item.icon}
                  </span>

                  <span className="text-sm font-medium">
                    {item.name}
                  </span>

                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E21B45] shadow-[0_0_8px_#E21B45]" />
                  )}
                </>
              )}
            </NavLink>
          ))}

        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="hidden md:block absolute bottom-8 left-6 right-6 border-t border-white/10 pt-6">

          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-[#FF4268] transition"
          >
            ← Back to website
          </Link>

          <p className="text-[10px] text-gray-700 mt-5 tracking-wider">
            LOVIQUE © 2026
          </p>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 min-w-0">

        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 h-20 px-5 md:px-10 flex items-center justify-between border-b border-white/10 bg-[#080808]/70 backdrop-blur-2xl">

          <div>
            <p className="text-xs text-gray-500 tracking-wider">
              YOUR PERSONAL SPACE
            </p>

            <h2 className="text-lg font-semibold tracking-wide">
              LOVIQUE <span className="text-[#E21B45]">/</span> Community
            </h2>
          </div>

          <div className="flex items-center gap-4">

            <Link
              to="/notifications"
              className="relative w-10 h-10 rounded-xl border border-white/10 bg-white/[0.05] flex items-center justify-center hover:bg-white/10 transition"
              aria-label="Notifications"
            >
              <span className="text-lg">♧</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#E21B45] rounded-full" />
            </Link>

            <Link
              to="/settings"
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E21B45] to-red-950 flex items-center justify-center font-bold shadow-lg shadow-red-950/30 hover:scale-105 transition"
              aria-label="Your profile settings"
            >
              U
            </Link>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-5 md:p-10">

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl shadow-2xl shadow-black/30 p-5 md:p-8 min-h-[70vh]">

            <Outlet />

          </div>

        </div>

      </main>

    </div>
  );
}
