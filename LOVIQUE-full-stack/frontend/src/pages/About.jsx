import { Heart, Users, ShieldCheck, Sparkles } from "lucide-react";

function About() {
  return (
    <main className="about-page">

      <section className="about-hero">
        <span className="about-label">OUR STORY</span>

        <h1>
          More Than Just <span>Connections.</span>
        </h1>

        <p>
          LOVIQUE is a space where meaningful connections begin,
          friendships grow, and everyone has a place to belong.
        </p>
      </section>

      <section className="about-content">
        <div className="about-text">
          <span className="about-label">WHO WE ARE</span>
          <h2>Creating spaces where people truly connect.</h2>

          <p>
            We believe that genuine connections make life more meaningful.
            That's why LOVIQUE was created: to bring people together through
            shared interests, supportive communities, and real conversations.
          </p>

          <p>
            Whether you're discovering new interests, meeting new people,
            or finding your community, LOVIQUE gives you a place to start.
          </p>
        </div>

        <div className="about-values">
          <div className="about-value">
            <Heart />
            <h3>Meaningful Connections</h3>
            <p>Encouraging genuine relationships.</p>
          </div>

          <div className="about-value">
            <ShieldCheck />
            <h3>Privacy First</h3>
            <p>Respecting your privacy and personal space.</p>
          </div>

          <div className="about-value">
            <Users />
            <h3>Community</h3>
            <p>Creating welcoming spaces for everyone.</p>
          </div>

          <div className="about-value">
            <Sparkles />
            <h3>Belonging</h3>
            <p>Helping everyone feel included.</p>
          </div>
        </div>
      </section>

      <section className="about-ending">
        <h2>Connect. Discover. Belong.</h2>
        <p>Your story starts with a connection.</p>
      </section>

    </main>
  );
}

export default About;