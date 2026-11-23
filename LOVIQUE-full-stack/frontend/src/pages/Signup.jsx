import { Heart, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
    setSuccess("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the community guidelines and privacy policy.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create your account.");
      }

      setSuccess(
        "Your account has been created successfully! You can now sign in."
      );

      setFormData({
        fullName: "",
        email: "",
        password: ""
      });

      setAcceptedTerms(false);

    } catch (err) {
      setError(
        err.message || "Unable to connect to LOVIQUE. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="rose-background"></div>
      <div className="auth-overlay"></div>

      <nav className="auth-navbar">
        <Link to="/" className="auth-logo">
          LOVIQUE<span>♥</span>
        </Link>

        <p>
          Already a member?{" "}
          <Link to="/login" className="auth-nav-link">
            Sign in
          </Link>
        </p>
      </nav>

      <main className="auth-container">
        <div className="auth-card signup-card">

          <div className="auth-icon">
            <Heart fill="currentColor" size={25} />
          </div>

          <span className="auth-eyebrow">
            YOUR STORY STARTS HERE
          </span>

          <h1>
            Find your
            <br />
            <span>place to belong.</span>
          </h1>

          <p className="auth-description">
            Create your account and discover your community.
          </p>

          <form className="auth-form" onSubmit={handleSignup}>

            <div className="auth-field">
              <label>Full name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                required
              />
            </div>

            <div className="auth-field">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="auth-terms">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />

              <span>
                I agree to the community guidelines and
                privacy policy.
              </span>
            </label>

            {error && (
              <p className="text-red-400 text-sm" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-400 text-sm" role="status">
                {success}{" "}
                <Link to="/login" className="underline font-semibold">
                  Sign in
                </Link>
              </p>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={19} />}
            </button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login"> Sign in</Link>
          </p>

          <div className="auth-footer">
            <Heart size={13} fill="currentColor" />
            <span>Connect • Discover • Belong</span>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Signup;