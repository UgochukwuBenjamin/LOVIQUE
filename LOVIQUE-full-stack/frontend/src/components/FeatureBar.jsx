import {
  Gem,
  ShieldCheck,
  Users,
  Zap
} from "lucide-react";

function FeatureBar() {

  const features = [
    {
      icon: <Gem />,
      title: "Shared Interests",
      subtitle: "Discover your people"
    },
    {
      icon: <ShieldCheck />,
      title: "Your Privacy",
      subtitle: "Our priority"
    },
    {
      icon: <Users />,
      title: "Supportive Spaces",
      subtitle: "A welcoming community"
    },
    {
      icon: <Zap />,
      title: "Easy Connections",
      subtitle: "Start connecting"
    }
  ];

  return (
    <section className="feature-section">

      <div className="feature-bar">

        {features.map((feature, index) => (
          <div className="feature" key={index}>

            <div className="feature-icon">
              {feature.icon}
            </div>

            <div>
              <h3>{feature.title}</h3>
              <p>{feature.subtitle}</p>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default FeatureBar;