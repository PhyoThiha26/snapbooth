import CameraStudio from "./CameraStudio";
import {
  ArrowRight,
  Camera,
  Heart,
  Image,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <a href="#" className="logo">
        snap<span>booth.</span>
        <span className="logo-star">✳</span>
      </a>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
      </div>

      <a href="#studio" className="nav-button">
        Enter the booth <ArrowRight size={16} />
      </a>

      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
    </nav>
  );
}

function PhotoPreview() {
  return (
    <div className="photo-composition">
      <div className="floating-note note-left">
        <Heart size={15} fill="currentColor" />
        little moments, big memories
      </div>

      <div className="photo-strip">
        <div className="strip-header">snapbooth. <span>♡</span></div>

        <div className="strip-photo photo-one">
          <span>01</span>
        </div>
        <div className="strip-photo photo-two">
          <span>02</span>
        </div>
        <div className="strip-photo photo-three">
          <span>03</span>
        </div>
        <div className="strip-photo photo-four">
          <span>04</span>
        </div>

        <div className="strip-footer">A DAY TO REMEMBER · 2026</div>
      </div>

      <div className="floating-note note-right">
        <Sparkles size={15} />
        made with love
      </div>

      <div className="decorative-star star-one">✳</div>
      <div className="decorative-star star-two">✧</div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="eyebrow">
          <span className="eyebrow-dot"></span>
          YOUR LITTLE CORNER OF MEMORIES
        </div>

        <h1>
          Life looks better
          <br />
          in <span>little frames.</span>
        </h1>

        <p className="hero-description">
          Capture your favorite moments, add a little magic,
          and turn everyday memories into something worth keeping.
        </p>

        <div className="hero-actions">
          <a href="#studio" className="primary-button">
            Start your booth <ArrowRight size={18} />
          </a>
          <a href="#how-it-works" className="secondary-button">
            Discover more
          </a>
        </div>

        <div className="hero-caption">
          <div className="avatar-stack">
            <span>♡</span>
            <span>✿</span>
            <span>✧</span>
          </div>
          <p>Little moments. Forever yours.</p>
        </div>
      </div>

      <PhotoPreview />
    </section>
  );
}

const features = [
  {
    icon: Camera,
    number: "01",
    title: "Capture the moment",
    description: "Use your camera to capture spontaneous moments with friends or on your own.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Make it your own",
    description: "Play with beautiful filters, charming frames and creative decorations.",
  },
  {
    icon: Image,
    number: "03",
    title: "Keep the memories",
    description: "Create your own photo strips and save your favorite memories.",
  },
];

function Features() {
  return (
    <section className="features section" id="features">
      <div className="section-heading">
        <span className="eyebrow">A LITTLE SOMETHING FOR EVERYONE</span>
        <h2>More than just <span>a photo.</span></h2>
        <p>Everything you need to turn simple moments into lovely memories.</p>
      </div>

      <div className="feature-grid">
        {features.map(({ icon: Icon, number, title, description }) => (
          <article className="feature-card" key={number}>
            <div className="feature-top">
              <span>{number}</span>
              <Icon size={23} strokeWidth={1.5} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="feature-decoration">✳</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["01", "Step inside", "Open the booth and get your camera ready."],
    ["02", "Strike a pose", "Choose your layout and capture your moments."],
    ["03", "Take it home", "Decorate your photos and download your creation."],
  ];

  return (
    <section className="how-section section" id="how-it-works">
      <div className="how-intro">
        <span className="eyebrow">SIMPLE AS ONE, TWO, THREE</span>
        <h2>Your memories, <span>your way.</span></h2>
        <p>No complicated setup. Just you, your camera and a little creativity.</p>
      </div>

      <div className="steps">
        {steps.map(([number, title, description]) => (
          <div className="step" key={number}>
            <span className="step-number">{number}</span>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StudioPreview() {
  return (
    <section className="studio-preview" id="studio">
      <div>
        <span className="eyebrow">YOUR PHOTOBOOTH IS WAITING</span>
        <h2>Ready for your <span>close-up?</span></h2>
        <p>Something lovely is just one click away.</p>
      </div>
      <button
        className="primary-button"
        onClick={() => alert("Our photobooth camera is coming in Stage 2!")}
      >
        Enter the booth <ArrowRight size={18} />
      </button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <a href="#" className="logo">snap<span>booth.</span><span className="logo-star">✳</span></a>
      <p>Made for memories, big and small. ♡</p>
      <span>© 2026 SnapBooth</span>
    </footer>
  );
}

// function App() {
//   return (
//     <>
//       <Navbar />
//       <main>
//         <Hero />
//         <Features />
//         <HowItWorks />
//         <StudioPreview />
//       </main>
//       <Footer />
//     </>
//   );
// }

// export default App;

function App() {
  return <CameraStudio />;
}

export default App;