
import { Star, Quote } from "lucide-react";

function Testimonials() {
  const testimonials = [
    {
      name: "Amara",
      role: "LOVIQUE Community Member",
      text: "LOVIQUE has given me a space to meet people who share my interests. I love how welcoming the community feels.",
    },
    {
      name: "Daniel",
      role: "LOVIQUE Community Member",
      text: "I joined looking to connect with new people, and I found a community where conversations feel natural and genuine.",
    },
    {
      name: "Sophia",
      role: "LOVIQUE Community Member",
      text: "What I love most about LOVIQUE is the sense of belonging. It's more than an app; it's a place to discover new connections.",
    },
  ];

  return (
    <section className="testimonials-section" id="testimonials">

      <div className="testimonials-heading">
        <span className="testimonials-label">KIND WORDS</span>

        <h2>
          Stories That <span>Connect Us</span>
        </h2>

        <p>
          Every connection has a story. Here's what our community
          might say about their LOVIQUE experience.
        </p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((item, index) => (
          <div className="testimonial-card" key={index}>

            <Quote className="quote-icon" />

            <div className="testimonial-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} fill="currentColor" />
              ))}
            </div>

            <p className="testimonial-text">
              "{item.text}"
            </p>

            <div className="testimonial-user">
              <div className="testimonial-avatar">
                {item.name.charAt(0)}
              </div>

              <div>
                <h3>{item.name}</h3>
                <span>{item.role}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}

export default Testimonials;
