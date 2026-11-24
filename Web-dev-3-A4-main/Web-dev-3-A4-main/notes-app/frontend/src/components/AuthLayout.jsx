import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth-art">
        <div className="brand">Jotter</div>
        <div className="stack" aria-hidden="true">
          <div className="sticky s1"><b>Buy milk</b><span>and the good bread</span></div>
          <div className="sticky s2"><b>Ideas</b><span>Landing page, pricing, onboarding</span></div>
          <div className="sticky s3"><b>Call Riya</b><span>Friday, 4 pm</span></div>
          <div className="sticky s4"><b>Read</b><span>One chapter a night</span></div>
        </div>
        <p className="auth-tag">Write it down once. Find it in seconds.</p>
      </aside>
      <main className="auth-form">
        <Link to="/" className="brand brand-sm">Jotter</Link>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
        <p className="auth-foot">{footer}</p>
      </main>
    </div>
  );
}
