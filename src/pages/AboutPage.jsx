const highlightStats = [
  { label: "Customers served", value: "125,000+" },
  { label: "Curated products", value: "1,400" },
  { label: "Vetted brands", value: "215" },
];

const coreValues = [
  {
    title: "Customer-first curation",
    detail:
      "We comb through thousands of items and surface only the products that meet our durability, sustainability, and value standards.",
  },
  {
    title: "Trust through transparency",
    detail:
      "From product testing to supplier audits, we publish the data behind every recommendation so you can buy with confidence.",
  },
  {
    title: "Community-driven impact",
    detail:
      "We reinvest a portion of every purchase into educational grants and local maker programs that strengthen our community.",
  },
];

const timeline = [
  {
    year: "2018",
    milestone: "EMD launched as a pop-up collective showcasing artisan-made essentials for modern living.",
  },
  {
    year: "2020",
    milestone: "Introduced our digital marketplace with rapid fulfillment and a locally sourced logistics network.",
  },
  {
    year: "2023",
    milestone: "Expanded into sustainable gifting and created our flagship retail experience in Montréal.",
  },
];

const teamMembers = [
  {
    name: "Alyssa Chen",
    role: "Co-founder & CEO",
    bio: "Leads strategic partnerships and ensures every collection reflects our mission of mindful consumption.",
  },
  {
    name: "Malik Rodriguez",
    role: "Head of Product Experience",
    bio: "Shapes the on-site journey, blending personalized discovery with frictionless checkout interfaces.",
  },
  {
    name: "Priya Desai",
    role: "Community Programs Director",
    bio: "Works with regional artisans and non-profits to design workshops and micro-grant initiatives.",
  },
];

function AboutPage() {
  return (
    <section className="page about-page">
      <span className="eyebrow">Who we are</span>
      <h1>About EMD</h1>
      <p className="about-lead">
        EMD began with a simple idea: thoughtful essentials should be easy to find, uncomplicated to purchase, and sourced from people who care about craft. Today we blend technology with human expertise to curate goods that elevate everyday living without compromising on ethics.
      </p>

      <div className="about-stats">
        {highlightStats.map((stat) => (
          <article key={stat.label} className="about-stat-card">
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </article>
        ))}
      </div>

      <div className="about-section">
        <h2>Our Values</h2>
        <div className="about-values">
          {coreValues.map((value) => (
            <article key={value.title} className="about-value-card">
              <h3>{value.title}</h3>
              <p>{value.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h2>Milestones</h2>
        <ul className="about-timeline">
          {timeline.map((entry) => (
            <li key={entry.year}>
              <span className="about-timeline-year">{entry.year}</span>
              <p>{entry.milestone}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="about-section">
        <h2>Meet the Team</h2>
        <div className="about-team">
          {teamMembers.map((member) => (
            <article key={member.name} className="about-team-card">
              <h3>{member.name}</h3>
              <span className="muted">{member.role}</span>
              <p>{member.bio}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h2>Looking Ahead</h2>
        <p>
          We are investing in reusable packaging pilots, expanding our same-day delivery footprint, and launching guided workshops so shoppers can connect with the makers behind their favorite pieces. Sign up for our newsletter to follow along and be the first to access limited releases.
        </p>
      </div>
    </section>
  );
}

export default AboutPage;
