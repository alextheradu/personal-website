import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar'
import Experience from './components/Experience/Experience'
import Projects from './components/Projects/Projects'
import ClientShowcase from './components/ClientShowcase/ClientShowcase'
// // Silk background
// // @ts-ignore - provided by jsrepo asset (no types)
// import Silk from './components/Backgrounds/Silk/Silk.jsx'
import DarkVeil from './components/Backgrounds/DarkVeil/DarkVeil'
import Contact from './pages/Contact'
// Pricing page intentionally kept in codebase but not routed/imported for now
// import PricingPage from './pages/Pricing'
import Admin from './pages/Admin'
import './App.css'
import Footer from './components/Footer/Footer'
import { useEffect } from 'react'

function App() {
  const [contactOpen, setContactOpen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      })
    }, { threshold: 0.2 });
    document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
      <>
      <div className="app-bg" aria-hidden="true">
        <DarkVeil speed={1} hueShift={0} noiseIntensity={0.01} monochrome />
      </div>
      {!isAdmin && <NavBar />}
      <main className="main-content">
      <Routes>
    <Route path="/admin" element={<Admin />} />
    {/* Pricing route removed from active site but component retained in repo */}
  <Route path="/*" element={<>
        <section id="hero" className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Alex Radu</h1>
            <h2 className="hero-subtitle">Full-Stack Developer & System Architect</h2>
            <p className="hero-desc">Crafting scalable web applications with React, Node.js, and modern infrastructure</p>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span className="feature-text">Performance Focused</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎨</span>
                <span className="feature-text">Design Forward</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span className="feature-text">Innovation Driven</span>
              </div>
            </div>
            {/* <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Projects Delivered</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">∞</span>
                <span className="stat-label">Coffee Consumed</span>
              </div>
            </div> */}
            <a href="#about" className="hero-cta">Explore My Work</a>
          </div>
          <div className="hero-scroll-indicator">
            <span className="scroll-arrow">▼</span>
            <span className="scroll-text">Scroll Down</span>
          </div>
        </section>

  <div className="content-wrapper">
          <section id="about" className="content-section about-section fade-in-section">
            <div className="section-header">
              <h2 className="section-title">About</h2>
              <div className="section-divider"></div>
            </div>
            <div className="about-content">
              <div className="about-text">
                <p className="about-desc">
                  I'm a passionate Full-Stack Developer with experience building scalable web applications. 
                  I specialize in React, Node.js, and modern cloud infrastructure, with a keen eye for design and performance optimization.
                </p>
                <p className="about-desc">
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
                  or enjoying a perfectly brewed cup of tea while planning my next innovative solution.
                </p>
              </div>
              <div className="about-skills">
                <h3 className="skills-title">Core Technologies</h3>
                <div className="skills-grid">
                  <span className="skill-tag">React & TypeScript</span>
                  <span className="skill-tag">Node.JS & Express</span>
                  <span className="skill-tag">PostgreSQL & MongoDB</span>
                  <span className="skill-tag">Nginx & Docker</span>
                  <span className="skill-tag">GraphQL & REST APIs</span>
                  <span className="skill-tag">CI/CD & DevOps</span>
                </div>
              </div>
            </div>
          </section>

          <section id="experience" className="content-section experience-section fade-in-section">
            <div className="section-header">
              <h2 className="section-title">Experience</h2>
              <div className="section-divider"></div>
            </div>
            <Experience />
          </section>

          <section id="projects" className="content-section projects-section fade-in-section">
            <div className="section-header">
              <h2 className="section-title">Featured Work</h2>
              <div className="section-divider"></div>
            </div>
            <Projects />
          </section>

          <section id="clients" className="content-section clients-section fade-in-section">
            <div className="section-header">
              <h2 className="section-title">Client Websites</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">
                Businesses and organizations I've helped establish their digital presence
              </p>
            </div>
            <ClientShowcase />
          </section>

          {/* Services section temporarily removed to keep focus purely personal */}

          <section id="contact" className="content-section contact-section fade-in-section">
            <div className="section-header">
              <h2 className="section-title">Get In Touch</h2>
              <div className="section-divider"></div>
            </div>
            <div className="contact-content">
              <p className="contact-desc">
                Ready to bring your ideas to life? Let's discuss how we can work together to create something exceptional.
              </p>
              <div className="contact-methods">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span className="contact-text">Available for new projects</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">💼</span>
                  <span className="contact-text">Open to consulting opportunities</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🤝</span>
                  <span className="contact-text">Interested in collaborations</span>
                </div>
              </div>
              <button className="contact-btn" onClick={() => setContactOpen(true)}>
                Start a Conversation
              </button>
            </div>
          </section>
        </div>
        <Footer />
        <Contact isOpen={contactOpen} onClose={() => setContactOpen(false)} />
        </>} />
      </Routes>
      </main>
      </>
  )
}

export default function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
