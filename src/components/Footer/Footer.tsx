import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-email">
          <span className="footer-email-label">Get in touch:</span>
          <a href="mailto:alex@alexradu.co" className="footer-email-link">
            alex@alexradu.co
          </a>
        </div>
        <div className="footer-divider" />
        <div className="footer-info">
          <p className="footer-text">© 2025 Alex Radu. Crafted with passion and precision.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
