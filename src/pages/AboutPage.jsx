function AboutPage() {
  return (
    <section className="page about-page">
      <h1>About EMD</h1>
      <p className="page-subtitle">
        We are a community-driven marketplace focused on quality goods and
        transparent experiences.
      </p>

      <section className="card about-story">
        <h2>Our Story</h2>
        <p>
          EMD started as a small pop-up shop in 2016 with a mission to connect
          local makers to shoppers seeking thoughtful products. Today we curate a
          catalog that balances trusted brands with emerging artisans, always
          keeping craftsmanship, sustainability, and fair pricing in mind.
        </p>
      </section>

      <section className="about-values">
        <h2>What Matters To Us</h2>
        <ul>
          <li>Responsible sourcing and minimal packaging.</li>
          <li>Fair partnerships with suppliers and creators.</li>
          <li>Support for customer care that solves problems fast.</li>
        </ul>
      </section>

      <section className="about-team card">
        <h2>Meet the Team</h2>
        <p>
          Our distributed crew spans design, engineering, and customer
          experience. Every decision starts with one question: how does this help
          shoppers discover products they will love?
        </p>
      </section>

      <section className="about-contact">
        <h2>Stay in Touch</h2>
        <p>
          Have ideas or feedback? Email hello@emdshop.example or join our
          newsletter for store updates, seasonal collections, and behind-the-
          scenes stories.
        </p>
      </section>
    </section>
  );
}

export default AboutPage;
