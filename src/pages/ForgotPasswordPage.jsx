import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiMail } from 'react-icons/fi';
import AuthLayout from './AuthLayout';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setSent(true);
  };

  return (
    <AuthLayout
      eyebrow="A QUICK RESET"
      title={sent ? 'Check your inbox.' : 'Forgot your password?'}
      description={sent ? 'If there’s an account for that email, we’ve sent a reset link.' : 'It happens. Enter your email and we’ll send you a link to reset your password.'}
      mode={<>Remembered it? <Link to="/signin">Sign in <FiArrowRight /></Link></>}
    >
      {sent ? (
        <div className="reset-success"><div className="success-icon"><FiCheck /></div><p>We sent a reset link to your email. It may take a minute to arrive.</p><button className="auth-submit" onClick={() => setSent(false)}>Try another email <FiArrowRight /></button></div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="reset-email">Email address</label>
          <div className="auth-input-wrap"><FiMail /><input id="reset-email" type="email" placeholder="you@example.com" autoComplete="email" required /></div>
          <button type="submit" className="auth-submit">Send reset link <FiArrowRight /></button>
          <Link to="/signin" className="back-to-signin"><FiArrowLeft /> Back to sign in</Link>
        </form>
      )}
    </AuthLayout>
  );
}
