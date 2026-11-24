
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProfileProvider } from "./ProfileContext";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Founders from "./components/Founders";
import DashboardLayout from "./components/DashboardLayout";
import FeatureBar from "./components/FeatureBar";

// Pages
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Communities from "./pages/Communities";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

// HOMEPAGE
function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <FeatureBar />

      <About />

      <Testimonials />

      <Founders />

      <Features />

      <Footer />
    </>
  );
}

// MAIN APP
export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>

        <Routes>

          {/* Homepage */}
          <Route path="/" element={<Home />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Dashboard */}
          <Route element={<DashboardLayout />}>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/discover" element={<Discover />} />

            <Route path="/communities" element={<Communities />} />

            <Route path="/messages" element={<Messages />} />

            <Route path="/notifications" element={<Notifications />} />

            <Route path="/settings" element={<Settings />} />

          </Route>

        </Routes>

      </BrowserRouter>
    </ProfileProvider>
  );
}
