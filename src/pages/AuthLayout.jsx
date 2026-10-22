import { FiArrowUpRight, FiCheck } from 'react-icons/fi';
import BrandMark from '../components/BrandMark';

export default function AuthLayout({ children, eyebrow, title, description, mode }) {
  return (
    <main className="auth-shell">
      <section className="auth-aside">
        <BrandMark />
        <div className="auth-aside-content">
          <div className="auth-kicker"><span /> A CALMER KIND OF INBOX</div>
          <h1>Make room for<br /><em>what matters.</em></h1>
          <p>A thoughtful place for your conversations, ideas, and everything in between.</p>
          <div className="auth-testimonial">
            <div className="testimonial-stars">★★★★★</div>
            <blockquote>“It feels like a deep breath every time I open my inbox.”</blockquote>
            <div className="testimonial-person"><div className="avatar avatar-profile">JL</div><span><strong>Jordan Lee</strong><small>Founder, June Studio</small></span><span className="testimonial-verified"><FiCheck /></span></div>
          </div>
        </div>
        <div className="auth-aside-footer"><span>© 2024 Northstar Mail</span><a href="mailto:hello@northstar.design">A little help <FiArrowUpRight /></a></div>
        <div className="auth-decoration decoration-one" /><div className="auth-decoration decoration-two" />
      </section>
      <section className="auth-main">
        <div className="auth-mobile-brand"><BrandMark /></div>
        <div className="auth-card">
          <div className="auth-heading"><span className="auth-eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
          {children}
          <p className="auth-terms">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
        </div>
        <div className="auth-mode-hint">{mode}</div>
      </section>
    </main>
  );
}
