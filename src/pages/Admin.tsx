import React, { useEffect, useState } from 'react';
import GlassSurface from '../components/GlassSurface/GlassSurface';

interface VisitRecord {
  ip: string;
  country?: string | null;
  city?: string | null;
  region?: string | null;
  timezone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  firstSeen: number;
  lastSeen: number;
  hits: number;
  userAgent?: string;
}

interface ApiResponse {
  totalUnique: number;
  totalHits: number;
  data: VisitRecord[];
}

const Admin: React.FC = () => {
  const [visits, setVisits] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/visits');
        if (!res.ok) throw new Error('Failed to load');
        const data: ApiResponse = await res.json();
        setVisits(data);
      } catch (e:any) {
        setError(e.message || 'Error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <GlassSurface width={1200} height="auto" borderRadius={32} brightness={60} className="admin-surface" saturation={1.2} backgroundOpacity={0.1} blur={18}>
        <div style={{ padding: '2rem', textAlign: 'left' }}>
          <h1 style={{ marginTop: 0 }}>Admin Dashboard</h1>
          {loading && <p>Loading visits...</p>}
          {error && <p style={{ color: 'tomato' }}>{error}</p>}
          {visits && !loading && !error && (
            <>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <Stat label="Unique Visitors" value={visits.totalUnique} />
                <Stat label="Total Hits" value={visits.totalHits} />
              </div>
              <div style={{ maxHeight: '60vh', overflow: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <th style={th}>IP</th>
                      <th style={th}>Location</th>
                      <th style={th}>Hits</th>
                      <th style={th}>First Seen</th>
                      <th style={th}>Last Seen</th>
                      <th style={th}>UA (truncated)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.data.map(v => (
                      <tr key={v.ip} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={td}>{v.ip}</td>
                        <td style={td}>{[v.city, v.region, v.country].filter(Boolean).join(', ') || '—'}</td>
                        <td style={td}>{v.hits}</td>
                        <td style={td}>{new Date(v.firstSeen).toLocaleString()}</td>
                        <td style={td}>{new Date(v.lastSeen).toLocaleString()}</td>
                        <td style={td}>{(v.userAgent || '').slice(0,60)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </GlassSurface>
    </section>
  );
};

const th: React.CSSProperties = { textAlign: 'left', padding: '0.6rem 0.75rem', position: 'sticky', top: 0 };
const td: React.CSSProperties = { padding: '0.5rem 0.75rem', verticalAlign: 'top' };

const Stat: React.FC<{ label: string; value: number | string; }> = ({ label, value }) => (
  <div style={{ padding: '0.9rem 1.2rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px' }}>
    <div style={{ fontSize: '0.75rem', letterSpacing: '0.08em', opacity: 0.75, textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontSize: '1.3rem', fontWeight: 600 }}>{value}</div>
  </div>
);

export default Admin;
