export default function About() {
  return (
    <main className="page">
      <section className="about-hero">
        <span className="eyebrow">OUR STORY</span>

        <h1>
          Preserving India's
          <span> Spice Heritage.</span>
        </h1>

        <p>
          SpiceCraft brings traditional Indian spice wisdom together
          with modern convenience.
        </p>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <span>01</span>
          <h2>Ingredient Selection</h2>
          <p>
            We believe great masala begins with carefully selected
            ingredients.
          </p>
        </div>

        <div className="about-card">
          <span>02</span>
          <h2>Roasting & Grinding</h2>
          <p>
            Carefully balanced roasting helps preserve aroma and flavour.
          </p>
        </div>

        <div className="about-card">
          <span>03</span>
          <h2>Made for Modern Kitchens</h2>
          <p>
            Authentic Indian flavours made simple for everyday cooking.
          </p>
        </div>
      </section>

      <section className="mission-section">
        <span className="eyebrow">OUR MISSION</span>
        <h2>
          Make authentic Indian cooking easier, one spice at a time.
        </h2>
      </section>
    </main>
  );
}