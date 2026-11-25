
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import faviconImage from "./images/as.jpg";
import { ProfileProvider } from "./ProfileContext";

import MainLayout from "./components/MainLayout";

// Homepage components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Founders from "./components/Founders";
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
import Profile from "./pages/Profile";

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

export default function App() {
  useEffect(() => {
    let favicon = document.querySelector("link[rel='icon']");

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    favicon.href = faviconImage;
  }, []);

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

          {/* Dashboard pages with shared navbar */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* About page */}
          <Route path="/about" element={<About />} />

        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}
