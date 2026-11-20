import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Welcome page */}
        <Route path="/" element={<Home />} />

        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;