
import { Heart, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
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
          New here?{" "}
          <Link to="/signup" className="auth-nav-link">
            Create account
          </Link>
        </p>
      </nav>

      <main className="auth-container">
        <div className="auth-card">

          <div className="auth-icon">
            <Heart fill="currentColor" size={25} />
          </div>

          <span className="auth-eyebrow">
            WELCOME BACK
          </span>

          <h1>
            Your world,
            <br />
            <span>your people.</span>
          </h1>

          <p className="auth-description">
            Sign in and reconnect with your community.
          </p>

          <form className="auth-form">

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
                  placeholder="Enter your password"
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

            <div className="auth-options">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button className="auth-submit" type="submit">
              Sign In
              <ArrowRight size={19} />
            </button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/signup"> Join LOVIQUE</Link>
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

export default Login;
