
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProfileProvider } from "./ProfileContext";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DashboardLayout from "./components/DashboardLayout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";

import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Communities from "./pages/Communities";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

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
