import { useState } from 'react';
import './ClientShowcase.css';

type Client = {
  id: string;
  name: string;
  domain: string;
  description: string;
  industry: string;
  technologies: string[];
  features: string[];
  status: 'live' | 'in-development' | 'maintenance';
  image?: string;
};

const CLIENTS: Client[] = [
  {
    id: 'novusimpakt',
    name: 'NovusImpakt',
    domain: 'novusimpakt.com',
    description: 'A modern business consulting platform with integrated project management portal features. (Portal is admin-only)',
    industry: 'Business Consulting',
    technologies: ['Node.js', 'HTML', 'SQLite'],
    features: ['Responsive Design', 'Admin Portal', 'Project Management'],
    status: 'live',
    image: 'https://via.placeholder.com/400x240/1e293b/64748b?text=NovusImpakt'
  }
];

export default function ClientShowcase() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const getStatusBadge = (status: Client['status']) => {
    const badges = {
      live: { text: '🟢 Live', class: 'status-live' },
      'in-development': { text: '🟡 In Development', class: 'status-dev' },
      maintenance: { text: '🔧 Maintenance', class: 'status-maintenance' }
    };
    return badges[status];
  };

  return (
    <div className="client-showcase">
      <div className="clients-grid">
        {CLIENTS.map((client) => {
          const statusBadge = getStatusBadge(client.status);
          return (
            <div 
              key={client.id} 
              className="client-card"
              onClick={() => setSelectedClient(client)}
            >
              <div className="client-image-container">
                {client.image && (
                  <img 
                    src={client.image} 
                    alt={`${client.name} website preview`}
                    className="client-image"
                    loading="lazy"
                  />
                )}
                <div className="client-overlay">
                  <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.text}
                  </span>
                </div>
              </div>
              
              <div className="client-content">
                <div className="client-header">
                  <div className="client-info">
                    <h3 className="client-name">{client.name}</h3>
                    <span className="client-domain">{client.domain}</span>
                  </div>
                </div>
                
                <div className="client-industry">{client.industry}</div>
                
                <p className="client-description">{client.description}</p>
                
                <div className="client-tech">
                  <div className="tech-tags">
                    {client.technologies.slice(0, 3).map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                    {client.technologies.length > 3 && (
                      <span className="tech-tag more">+{client.technologies.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <div className="client-actions">
                  <button className="view-details-btn">
                    <span className="btn-text">View Details</span>
                    <span className="btn-icon">→</span>
                  </button>
                  {client.status === 'live' && (
                    <a 
                      href={`https://${client.domain}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="visit-live-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="visit-icon">🌐</span>
                      Visit Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedClient && (
        <div className="client-modal-overlay" onClick={() => setSelectedClient(null)}>
          <div className="client-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedClient.name}</h2>
              <button 
                className="close-btn" 
                onClick={() => setSelectedClient(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-info">
                <span className="modal-domain">{selectedClient.domain}</span>
                <span className={`status-badge ${getStatusBadge(selectedClient.status).class}`}>
                  {getStatusBadge(selectedClient.status).text}
                </span>
              </div>
              
              <div className="modal-industry">{selectedClient.industry}</div>
              <p className="modal-description">{selectedClient.description}</p>
              
              <div className="modal-details">
                <div className="modal-section">
                  <h3>Technologies Used</h3>
                  <div className="tech-tags">
                    {selectedClient.technologies.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
                
                <div className="modal-section">
                  <h3>Key Features</h3>
                  <ul className="features-list">
                    {selectedClient.features.map(feature => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {selectedClient.status === 'live' && (
                <div className="modal-actions">
                  <a 
                    href={`https://${selectedClient.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="visit-site-btn"
                  >
                    Visit Live Site
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
