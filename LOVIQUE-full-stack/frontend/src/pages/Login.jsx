
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const loadingStages = [
  {
    title: "Signing you in",
    description: "Verifying your credentials securely...",
  },
  {
    title: "Connecting to LOVIQUE",
    description: "Your secure session is being established...",
  },
  {
    title: "Loading your profile",
    description: "Retrieving your profile and preferences...",
  },
  {
    title: "Preparing your experience",
    description: "Getting your LOVIQUE space ready...",
  },
  {
    title: "Taking you home",
    description: "Almost there. Welcome back!",
  },
];

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const readResponse = async (response) => {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        `The server returned an unexpected response (${response.status}). Please try again.`
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setCurrentStage(0);

      // STAGE 1: Authenticate user
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token) {
        throw new Error("Authentication token was not returned.");
      }

      // STAGE 2: Establish authenticated session
      sessionStorage.setItem("lovique_token", data.token);
      setCurrentStage(1);

      // STAGE 3: Retrieve user's profile
      setCurrentStage(2);

      const profileResponse = await fetch(
        `${API_URL}/api/profiles/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      let hasCompletedOnboarding = false;

      if (profileResponse.status === 404) {
        // New user: no profile exists yet.
        hasCompletedOnboarding = false;
      } else {
        const profileData = await readResponse(profileResponse);

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message || "Unable to load your profile."
          );
        }

        hasCompletedOnboarding =
          profileData.profile?.onboardingCompleted === true;
      }

      // STAGE 4: Prepare the appropriate destination
      setCurrentStage(3);

      // STAGE 5: Redirect user
      setCurrentStage(4);

      if (hasCompletedOnboarding) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const stage = loadingStages[currentStage];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-md bg-[#171717] border border-gray-800 rounded-2xl p-8 shadow-xl">

        {/* Loading Experience */}
        {loading ? (
          <div className="py-8">

            <Link to="/" className="logo">
              <span className="logo-text">LOVIQUE</span>
            </Link>

            <div className="flex flex-col items-center text-center mt-12">

              {/* Animated Loader */}
              <div className="relative w-20 h-20 flex items-center justify-center mb-8">

                <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>

                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C11235] animate-spin"></div>

                <div className="w-3 h-3 bg-[#C11235] rounded-full animate-pulse"></div>

              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                {stage.title}
              </h2>

              <p className="text-gray-400 text-sm mb-10">
                {stage.description}
              </p>

            </div>

            {/* Progress Stages */}
            <div className="space-y-6">

              {loadingStages.map((item, index) => {

                const completed = index < currentStage;
                const active = index === currentStage;

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4"
                  >

                    {/* Stage Indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-300 ${
                        completed
                          ? "bg-[#C11235] text-white"
                          : active
                          ? "border-2 border-[#C11235] text-[#C11235]"
                          : "border border-gray-700 text-gray-600"
                      }`}
                    >
                      {completed ? (
                        "✓"
                      ) : active ? (
                        <span className="w-2 h-2 bg-[#C11235] rounded-full animate-pulse"></span>
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Stage Information */}
                    <div className="flex-1">

                      <p
                        className={`text-sm font-semibold ${
                          completed || active
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {item.title}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {completed
                          ? "Completed"
                          : active
                          ? "In progress..."
                          : "Waiting"}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

            <p className="text-center text-gray-600 text-xs mt-12">
              Please keep this page open while we prepare your experience.
            </p>

          </div>
        ) : (
          <>
            {/* Logo */}
            <Link to="/" className="logo">
              <span className="logo-text">LOVIQUE</span>
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
                autoComplete="email"
                required
                disabled={loading}
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
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full bg-[#242424] text-white border border-gray-700 rounded-lg p-3 mb-5 outline-none focus:border-[#C11235]"
              />

              {/* Error */}
              {error && (
                <p
                  className="text-red-400 text-sm mb-4"
                  role="alert"
                >
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
                disabled={loading}
                className="w-full bg-[#C11235] hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
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
              <Link
                to="/"
                className="text-gray-500 text-sm hover:text-white"
              >
                ← Back to Home
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}