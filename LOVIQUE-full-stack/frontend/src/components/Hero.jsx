
import {
  Heart,
  ArrowRight,
  Play
} from "lucide-react";

import { Link } from "react-router-dom";

import coupleImage from "../images/lovique-couple.png";
import flowersImage from "../images/lovique-flowers.png";

function Hero() {
  return (
    <section className="hero" id="home">

      <div className="hero-content">

        <div className="hero-text">

          <div className="hero-label">
            <Heart size={17} fill="currentColor" />
            <span>A place to belong...</span>
          </div>

          <h1>LOVIQUE</h1>

          <h2>
            Connect <span>•</span> Discover <span>•</span> Belong
          </h2>

          <p>
            Find your people, discover shared interests,
            and build meaningful connections in a
            community where you belong.
          </p>

          <div className="hero-buttons">

            {/* Go to signup */}
            <Link to="/signup" className="get-started">
              Get Started
              <ArrowRight size={20} />
            </Link>

            {/* Go to about section */}
            <a href="#about" className="watch-video">
              <span className="play-icon">
                <Play size={17} fill="currentColor" />
              </span>
              How it works
            </a>

          </div>

          <div className="members">

            <div className="member-avatars">
              <span>A</span>
              <span>T</span>
              <span>M</span>
              <span>J</span>
            </div>

            <div className="member-text">
              <strong>Shared Interests</strong>
              <small>Find your community</small>
            </div>

          </div>

        </div>

        {/* Couple image */}
        <div className="hero-image">

          <div className="glow-circle"></div>
          <div className="glow-circle second"></div>

          <img
            src={coupleImage}
            alt="LOVIQUE featured people"
            className="couple-image"
          />

          {/* Flower overlay */}
          {/* <img
            src={flowersImage}
            alt=""
            className="hero-flowers" */}
        

        </div>

      </div>

    </section>
  );
}

export default Hero;
