import React from 'react';
import './Experience.css';

const skills = [
  'React',
  'TypeScript',
  'Node.js',
  'HTML / CSS / JavaScript',
  'Java',
  'Shell Scripting',
  'Server Administration',
  'Network Administration',
  'UI/UX Design',
  'Cloud & DevOps'
];

const Experience: React.FC = () => {
  return (
    <section className="experience" id="experience">
      <p className="tagline">Here's a quick look at my skills and background. I love building modern web apps, designing beautiful interfaces, and solving tough problems.</p>
      <div className="exp-timeline">
        <div className="exp-item">
          <div className="exp-dot" />
          <div className="exp-content">
            <h3>InfoTech Member @ Pascack Pi-oneers</h3>
            <span className="exp-date">2024 - Present</span>
            <p>Working on the InfoTech sub-division of the Pascack Pi-oneers (FRC 1676) as web developer.</p>
          </div>
        </div>
        <div className="exp-item">
          <div className="exp-dot" />
          <div className="exp-content">
            <h3>Apps Lead @ Pascack Pi-oneers</h3>
            <span className="exp-date">2025 - Present</span>
            <p>Lead the Apps Project Group in the Pascack Pi-oneers (FRC 1676) team.</p>
          </div>
        </div>
        <div className="exp-item">
          <div className="exp-dot" />
          <div className="exp-content">
            <h3>AP Computer Science Student @ PHHS</h3>
            <span className="exp-date">2025 - 2026</span>
            <p>Learned many universal computer science concepts and Java.</p>
          </div>
        </div>
      </div>
      <ul className="skills-list">
        {skills.map(skill => (
          <li key={skill} className="skill-chip">{skill}</li>
        ))}
      </ul>
    </section>
  );
};

export default Experience;
