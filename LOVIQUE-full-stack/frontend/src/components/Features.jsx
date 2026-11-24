
import {
  Heart,
  ShieldCheck,
  Users,
  Zap,
  MessageCircle,
  Compass,
  Lock,
  Sparkles
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: <Heart />,
      title: "Meaningful Connections",
      description:
        "Discover people who share your interests and build genuine connections that matter."
    },
    {
      icon: <ShieldCheck />,
      title: "Privacy & Safety",
      description:
        "Your privacy matters. Enjoy a community designed with respect, safety and control in mind."
    },
    {
      icon: <Users />,
      title: "Supportive Communities",
      description:
        "Find welcoming spaces where you can share ideas, explore interests and feel included."
    },
    {
      icon: <Zap />,
      title: "Easy Connections",
      description:
        "Enjoy a simple experience that makes discovering and connecting with people easier."
    },
    {
      icon: <MessageCircle />,
      title: "Real Conversations",
      description:
        "Start conversations, exchange ideas and get to know people beyond first impressions."
    },
    {
      icon: <Compass />,
      title: "Discover New Interests",
      description:
        "Explore communities and discover new interests, experiences and perspectives."
    },
    {
      icon: <Lock />,
      title: "Personal Control",
      description:
        "Manage your profile and choose how you participate in the LOVIQUE community."
    },
    {
      icon: <Sparkles />,
      title: "A Place to Belong",
      description:
        "Be part of a community where different interests and personalities are welcomed."
    }
  ];

  return (
    <main className="features-page">

      <section className="features-page" id="features">
        <span className="features-label">THE LOVIQUE EXPERIENCE</span>

        <h1>
          Everything You Need to
          <span> Connect.</span>
        </h1>

        <p>
          Discover the features that make LOVIQUE a place
          for meaningful connections, shared interests and belonging.
        </p>
      </section>

      <section className="features-content">

        <div className="features-intro">
          <span className="features-label">WHAT WE OFFER</span>
          <h2>Designed Around You</h2>
          <p>
            Every feature is designed to make your experience
            more welcoming, meaningful and enjoyable.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="features-card" key={index}>

              <div className="features-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <span className="features-number">
                {String(index + 1).padStart(2, "0")}
              </span>

            </div>
          ))}
        </div>

      </section>

      <section className="features-ending">
        <span className="features-label">YOUR SPACE. YOUR PEOPLE.</span>
        <h2>Connect. Discover. Belong.</h2>
        <p>Your next meaningful connection could start here.</p>
      </section>

    </main>
  );
}

export default Features;
