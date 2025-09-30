import GlassSurface from "../GlassSurface/GlassSurface";
import whiteLogo from '../../assets/white-logo.svg';
import './NavBar.css';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '#about' },
  // Pricing link intentionally disabled; page retained in repo
  { label: 'Contact', href: '#contact' }
];

const NavBar: React.FC = () => {
  return (
    <div className="nav-shell" role="navigation" aria-label="Main">
      {/* Desktop / Tablet: Logo Surface */}
      <GlassSurface
        width="auto"
        height={54}
        borderRadius={34}
        borderWidth={0.12}
        className="nav-bar nav-bar--logo"
        brightness={60}
        opacity={1}
        blur={12}
        backgroundOpacity={0.12}
        saturation={1.15}
        distortionScale={-210}
        displace={0.5}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
      >
        <div className="nav-bar__inner nav-bar__inner--logo">
          <div className="nav-bar__brand">
            <a href="/" aria-label="Home" className="nav-bar__brandLink">
              <img src={whiteLogo} alt="Site logo" loading="eager" fetchPriority="high" decoding="async" />
            </a>
          </div>
        </div>
      </GlassSurface>

      {/* Desktop / Tablet: Links Surface */}
      <GlassSurface
        width="auto"
        height={54}
        borderRadius={34}
        borderWidth={0.12}
        className="nav-bar nav-bar--links"
        brightness={60}
        opacity={1}
        blur={12}
        backgroundOpacity={0.12}
        saturation={1.15}
        distortionScale={-210}
        displace={0.5}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
      >
        <div className="nav-bar__inner nav-bar__inner--links">
          <ul className="nav-bar__links">
            {links.map(l => (
              <li key={l.href} className="nav-bar__item">
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </GlassSurface>

      {/* Mobile Unified Surface */}
      <GlassSurface
        width="100%"
        height={56}
        borderRadius={28}
        borderWidth={0.12}
        className="nav-bar nav-bar--mobile"
        brightness={60}
        opacity={1}
        blur={12}
        backgroundOpacity={0.12}
        saturation={1.15}
        distortionScale={-210}
        displace={0.5}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
      >
        <div className="nav-bar__inner nav-bar__inner--mobile">
          <div className="nav-bar__brand">
            <a href="/" aria-label="Home" className="nav-bar__brandLink">
              <img src={whiteLogo} alt="Site logo" loading="eager" fetchPriority="high" decoding="async" />
            </a>
          </div>
          <ul className="nav-bar__links">
            {links.map(l => (
              <li key={l.href} className="nav-bar__item">
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </GlassSurface>
    </div>
  );
};

export default NavBar;
