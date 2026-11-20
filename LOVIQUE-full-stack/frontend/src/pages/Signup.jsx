
import { Heart, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

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

          <form className="auth-form">

            <div className="auth-field">
              <label>Full name</label>
              <input
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="auth-field">
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="auth-terms">
              <input type="checkbox" required />
              <span>
                I agree to the community guidelines and
                privacy policy.
              </span>
            </label>

            <button className="auth-submit" type="submit">
              Create Account
              <ArrowRight size={19} />
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
