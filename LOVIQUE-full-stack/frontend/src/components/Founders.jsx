import "./Founders.css";
import founders from "../data/founders.json";

import founder1 from "../images/founder-1.jpg";
import founder2 from "../images/founder-2.jpg";
import founder3 from "../images/founder-3.jpg";

const founderImages = {
  1: founder1,
  2: founder2,
  3: founder3
};

function Founders() {
  return (
    <main className="founders-page">

      <section className="founders-hero">
        <span className="founders-label">
          THE PEOPLE BEHIND THE VISION
        </span>

        <h1>
          Meet Our <span>Founders.</span>
        </h1>

        <p>
          Every meaningful connection begins with a vision.
          Meet the people whose passion, creativity, and dedication
          brought LOVIQUE to life.
        </p>
      </section>

      <section className="founders-section">

        <div className="founders-heading">
          <span>OUR LEADERSHIP</span>

          <h2>The Minds Behind LOVIQUE</h2>

          <p>
            Three individuals. One vision. A shared commitment
            to creating something meaningful.
          </p>
        </div>

        <div className="founders-grid">

          {founders.slice(0, 3).map((founder) => (
            <article className="founder-card" key={founder.id}>

              <div className="founder-image">
                <img
                  src={founderImages[founder.id]}
                  alt={founder.name}
                  loading="lazy"
                />

                <span className="founder-number">
                  0{founder.id}
                </span>
              </div>

              <div className="founder-info">
                <span className="founder-company">
                  {founder.company}
                </span>

                <h3>{founder.name}</h3>
                <h4>{founder.position}</h4>
                <p>{founder.bio}</p>
              </div>

            </article>
          ))}

        </div>
      </section>

      <section className="founders-ending">

        <span>ONE VISION. THREE FOUNDERS.</span>

        <h2>
          Building connections.
          <br />
          Creating something <span>meaningful.</span>
        </h2>

        <p>
          LOVIQUE is more than a platform. It is a vision
          built on connection, trust, and belonging.
        </p>

      </section>

    </main>
  );
}

export default Founders;