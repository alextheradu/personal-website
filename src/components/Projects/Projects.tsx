import React from 'react';
import './Projects.css';

interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  repo?: string;
}

const projects: Project[] = [
  {
    title: 'Personal Website',
    description: 'A personal website showcasing my projects and skills (the website you are on now).',
    tech: ['React', 'TypeScript', 'CSS'],
    repo: 'https://github.com/alextheradu/personal-website'
  },
  {
    title: 'AceIt',
    description: 'A flashcard studying app which is free to use and open source.',
    tech: ['Svelte, TypeScript', 'CSS', 'SQL'],
    repo: 'https://github.com/PioneersTeam1676/aceit'
  },
  {
    title: 'FRC Tree',
    description: 'Networking application for FIRST teams to share important links/information easily.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Svelte', 'SQL'],
    repo: 'https://github.com/PioneersTeam1676/FRC-Tree'
  }
];

const Projects: React.FC = () => {
  return (
    <div className="projects" id="projects-content" aria-labelledby="projects-heading">
      <p className="projects__tagline">A snapshot of things I build – focusing on performance, resilience and delightful UX.</p>
      <div className="projects__grid">
        {projects.map(p => (
          <div key={p.title} className="project-card">
            <div className="project-card__inner">
              <h3 className="project-card__title">{p.title}</h3>
              <p className="project-card__desc">{p.description}</p>
              <ul className="project-card__tech">
                {p.tech.map(t => <li key={t}>{t}</li>)}
              </ul>
              <div className="project-card__links">
                {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer">Repo</a>}
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer">Live</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
