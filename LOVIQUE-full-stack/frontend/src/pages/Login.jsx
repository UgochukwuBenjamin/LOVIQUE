
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    // Demo navigation only.
    // Replace this with your Flask authentication request
    // and navigate only when the backend confirms success.
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-md bg-[#171717] border border-gray-800 rounded-2xl p-8 shadow-xl">

        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-[#C11235]">
          LOVIQUE
        </Link>

        <h2 className="text-2xl font-bold text-white mt-8 mb-2">
          Welcome Back
        </h2>

        <p className="text-gray-400 mb-8">
          Sign in to continue your LOVIQUE experience.
        </p>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <label className="block text-white mb-2">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full bg-[#242424] text-white border border-gray-700 rounded-lg p-3 mb-5 outline-none focus:border-[#C11235]"
          />

          {/* Password */}
          <label className="block text-white mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full bg-[#242424] text-white border border-gray-700 rounded-lg p-3 mb-5 outline-none focus:border-[#C11235]"
          />

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm mb-4">
              {error}
            </p>
          )}

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-[#C11235] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#C11235] hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Sign In
          </button>

        </form>

        {/* Signup */}
        <p className="text-center text-gray-400 mt-7">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#C11235] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>

        <div className="text-center mt-8">
          <Link to="/" className="text-gray-500 text-sm hover:text-white">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
